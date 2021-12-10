import Link from 'next/link';
import Image from 'next/image';
const PetCard = () => {
  return (
    <div className='card d-block border-0 shadow-xss rounded-3 overflow-hidden rounded-xxl'>
      <div
        className='card-body position-relative h100 bg-image-cover bg-image-center'
        style={{ backgroundImage: `url("https://picsum.photos/200/300")` }}
      ></div>
      <div className='card-body d-block w-100 pl-10 pe-4 pb-4 pt-0 text-left position-relative'>
        <figure
          className='avatar position-absolute w75 z-index-1 left-15'
          style={{ marginTop: `-40px` }}
        >
          <div className={`image-container`}>
            <Image
              layout='fill'
              src={'https://picsum.photos/200'}
              alt='avatar'
              className='image float-right p-1 bg-white rounded-circle w-100 '
            />
          </div>
        </figure>
        <div className='clearfix'></div>
        <h4 className='fw-700 font-xsss mt-3 mb-1'>Hehehe</h4>
        <p className='fw-500 font-xsssss text-grey-500 mt-0 mb-3 lh-3'>
          @mickey
        </p>
        <span className='position-absolute right-15 top-0 d-flex align-items-center'>
          <Link href='/defaultgroup'>
            <a className='text-center p-2 lh-24 w100 ms-1 ls-3 d-inline-block rounded-xl bg-current font-xsssss fw-700 ls-lg text-white'>
              FOLLOW
            </a>
          </Link>
        </span>
      </div>
    </div>
  );
};

export default PetCard;
