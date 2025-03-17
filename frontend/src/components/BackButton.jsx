import React from 'react';
import { BsArrowLeft } from 'react-icons/bs';
import {Link} from 'react-router-dom';

function BackButton({destination='/'}) {
  return (
    <div className='flex justify-center mt-2'>
        <Link to={destination} className='w-fit rounded-lg bg-sky-800 text-white '>
            <BsArrowLeft className = 'text-2xl' />
        </Link>
    </div>
  )

}

export default BackButton;