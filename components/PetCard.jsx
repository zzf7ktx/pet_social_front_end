import Link from 'next/link';
import Image from 'next/image';
import axiosClient from 'axiosSetup';
import { useState } from 'react';

const PetCard = ({
  pet,
  as,
  hideButton,
  buttonCallback,
  buttonLabel,
  className,
  followed,
  mutateFollowing,
  mutate,
  onClick,
  isUser = false,
}) => {
  const [isFollowed, setIsFollowed] = useState(followed);
  const follow = async () => {
    try {
      setIsFollowed(true);
      await axiosClient.post(`/following/follow`, { pet_id: pet.id });
      mutate();
    } catch (error) {
      console.log(error);
    }
  };
  const unfollow = async () => {
    try {
      setIsFollowed(false);
      await axiosClient.post(`/following/unfollow`, { pet_id: pet.id });
      mutate();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div
      className={`${
        className || ''
      } card d-block border-0 shadow-xss rounded-3 overflow-hidden rounded-xxl`}
      as={as || 'div'}
    >
      <div className='card-body p-0 position-relative h100'>
        <Image
          src={pet?.background || 'https://via.placeholder.com/430x100'}
          alt='back'
          width={430}
          height={100}
          layout='responsive'
        />
      </div>
      <div className='card-body d-block w-100 pl-10 pe-4 pb-4 pt-0 text-left position-relative'>
        <figure
          className='avatar position-absolute w75 left-15 cursor-pointer'
          style={{ marginTop: `-40px` }}
          onClick={onClick}
        >
          <Image
            width={100}
            height={100}
            src={pet?.avatar || 'https://via.placeholder.com/100'}
            alt='avatar'
            className='p-1 bg-white rounded-circle'
          />
        </figure>
        <div className='clearfix'></div>
        <h4 className='fw-700 font-xsss mt-3 mb-1'>
          {isUser
            ? `Owner: ${pet?.first_name} ${pet?.last_name}`
            : pet?.name || 'Name'}
        </h4>
        <p className='fw-500 font-xsssss text-grey-500 mt-0 mb-3 lh-3'>
          {/* @mickey */}
        </p>
        {!hideButton && !isUser && (
          <span className='position-absolute right-15 top-0 d-flex align-items-center'>
            <a
              onClick={
                buttonCallback ? buttonCallback : isFollowed ? unfollow : follow
              }
              className='cursor-pointer text-center p-2 lh-24 w100 ms-1 ls-3 d-inline-block rounded-xl bg-current font-xsssss fw-700 ls-lg text-white'
            >
              {buttonLabel ? buttonLabel : isFollowed ? 'Un-follow' : 'Follow'}
            </a>
          </span>
        )}
      </div>
    </div>
  );
};

export default PetCard;
