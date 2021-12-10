import { Card, Form } from 'react-bootstrap';
import { FiX, FiAtSign, FiHash } from 'react-icons/fi';
import { FaArrowUp } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import axiosClient from 'axiosSetup';
import Image from 'next/image';
import styles from './UploadImage.module.scss';
import DragAndDrop from 'components/draganddrop/DragAndDrop';
import Button from 'components/controls/Button';
import useSWR, { useSWRConfig } from 'swr';
import { useRouter } from 'next/router';
import { host as serverHost } from 'config';
import { ProgressBar } from 'react-bootstrap';

import { ethers } from 'ethers';
import Web3Modal from 'web3modal';
import { nftaddress, nftmarketaddress } from 'config';
import NFT from 'artifacts/contracts/NFT.sol/NFT.json';
import NFTMarket from 'artifacts/contracts/NFTMarket.sol/NFTMarket.json';
import { create as ipfsHttpClient } from 'ipfs-http-client';

const client = ipfsHttpClient({ url: 'https://ipfs.infura.io:5001/api/v0' });

const UploadImage = ({ content, onSubmit, isEdit }) => {
  const { mutate } = useSWRConfig();
  const router = useRouter();

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [file, setFile] = useState('');
  const [caption, setCaption] = useState('');
  const [loaded, setLoaded] = useState(-1);

  const [status, setStatus] = useState('');
  const [isMint, setIsMint] = useState(false);

  useEffect(() => {
    if (isEdit) {
      setImage(content.media_URL);
      setCaption(content.caption);
    }
  }, [content]);

  const handleChange = (e) => {
    let file = e.target.files[0];
    setFile(file);

    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setImage(reader.result);
    };
  };

  const handleDrop = (file) => {
    console.log('sds', file);

    setFile(file);

    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setImage(reader.result);
    };
  };

  const handleClose = () => {
    setImage('');
    setStatus('');
  };

  const handleUpload = async () => {
    var bodyFormData = new FormData();
    bodyFormData.append('image', file);
    bodyFormData.append('caption', caption);
    bodyFormData.append('user_id', 1);

    let newForm = new FormData();
    newForm.append('file', file);
    newForm.append('model_choice', 'last');
    newForm.append('result_type', 'json');

    let result;
    try {
      result = await axiosClient.post(`localhost:2000`, newForm, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setStatus();
    } catch (err) {
      // logging
    }

    try {
      result = await axiosClient.post(`${serverHost}/posts`, bodyFormData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: function (progressEvent) {
          let percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          console.log(percentCompleted);
          setLoaded(percentCompleted);
        },
      });
    } catch (err) {
      // logging
    }
    // if result
    console.log('result: ', result);
    mutate('/posts');
    router.push('/post/' + result.data.id);
  };

  const handleEdit = () => {};

  const handleClickReset = () => {
    setImage(content.media_URL);
    setCaption(content.caption);
  };

  const uploadImageIPFS = async () => {
    // Upload image
    try {
      console.log('inupload', file);
      const added = await client.add(file, {
        progress: (prog) => console.log(`received: ${prog}`),
      });
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;

      return url;
    } catch (error) {
      console.log('Error uploading file: ', error);
    }
  };

  const handleMintAndSell = async () => {
    // Upload image
    const fileUrl = await uploadImageIPFS();

    if (!name || !caption || !price || !fileUrl || fileUrl === '') {
      return;
    }

    // Upload to IPFS
    const data = JSON.stringify({
      name,
      description: caption,
      image: fileUrl,
    });
    try {
      const added = await client.add(data);
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      /* after file is uploaded to IPFS, pass the URL to save it on Polygon */
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();

      // Create the item token
      let contract = new ethers.Contract(nftaddress, NFT.abi, signer);
      let transaction = await contract.createToken(url);
      // After transaction
      let tx = await transaction.wait();
      let event = tx.events[0];
      let value = event.args[2];
      let tokenId = value.toNumber();
      const priceParsed = ethers.utils.parseUnits(price, 'ether');

      // List the item for sale on the marketplace
      contract = new ethers.Contract(nftmarketaddress, NFTMarket.abi, signer);
      let listingPrice = await contract.getListingPrice();
      listingPrice = listingPrice.toString();

      transaction = await contract.createMarketItem(
        nftaddress,
        tokenId,
        priceParsed,
        { value: listingPrice }
      );
      await transaction.wait();
    } catch (error) {
      console.log('Error uploading file: ', error);
    }
  };

  const handleMint = async () => {};

  return (
    <>
      <Card className={`${styles['create-post-card']} shadow-xss rounded-xxl`}>
        <Card.Body className='d-flex' style={{ margin: 20 }}>
          <DragAndDrop handleDrop={handleDrop}>
            <div
              className={`${styles['image-upload']} d-flex rounded-xxxl position-relative justify-content-center align-items-center text-align-center`}
            >
              {image ? (
                <>
                  <div className='image-container'>
                    <Image
                      layout='fill'
                      className='image rounded-xxxxl'
                      src={image}
                      alt='image'
                    />
                    <FiX
                      onClick={handleClose}
                      className={`${styles['btn-close']} rounded-circle position-absolute`}
                    />
                  </div>
                </>
              ) : (
                <div
                  className={`${styles['browse-file-container']}  d-flex flex-column justify-content-center align-items-center`}
                >
                  <div
                    className={`${styles['upload-button']} mb-3 d-flex justify-content-center align-items-center position-relative rounded-circle`}
                  >
                    <input type='file' onChange={handleChange} />
                    <FaArrowUp />
                  </div>
                  <h6>Drag and drop or click to upload</h6>
                </div>
              )}
            </div>
          </DragAndDrop>

          <div className={`position-relative w-100 ms-3`}>
            {isMint && (
              <>
                <h3>Name</h3>
                <Form.Control
                  label={''}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  as='textarea'
                  rows={1}
                  className={`rounded-xxl ${styles['textarea']}`}
                />
                <h3>Price</h3>
                <Form.Control
                  label={''}
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  as='textarea'
                  rows={1}
                  className={`rounded-xxl ${styles['textarea']}`}
                />
              </>
            )}
            <h3>Tell your story</h3>
            <div className={`rounded-xxl ${styles['typing-box']}`}>
              <Form.Control
                label={''}
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                as='textarea'
                rows={5}
                style={{
                  borderBottom: '30px solid #F1F1F1 !important',
                }}
                className={`rounded-xxl ${styles['textarea']}`}
              />

              <div
                style={{}}
                className={`${styles['action-button']} position-absolute w-100 left-0 bottom-0`}
              >
                <FiHash /> Tag
                <FiAtSign /> Mention
              </div>
            </div>
            {!isEdit && (
              <Form.Check
                checked={isMint}
                onChange={() => setIsMint(!isMint)}
                label='Create as NFT token (wallet connected require)'
              />
            )}
            {loaded > 0 ? (
              <ProgressBar animated now={loaded} />
            ) : (
              <div className={`mt-3`}>
                {isMint ? (
                  <Button onClick={handleMintAndSell}>
                    Create token and Listing to market
                  </Button>
                ) : (
                  <Button onClick={handleUpload}>Post</Button>
                )}{' '}
                {isEdit && <Button onClick={handleClickReset}>Reset</Button>}
              </div>
            )}
          </div>
        </Card.Body>
      </Card>
    </>
  );
};

export default UploadImage;
