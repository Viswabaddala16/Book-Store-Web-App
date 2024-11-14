import {BiUserCircle} from 'react-icons/bi';
import {PiBookOpenText} from 'react-icons/pi';
import { AiOutlineClose } from 'react-icons/ai';


const BookModal = ({book,onClose}) => {
  return (
    <div className='bg-black fixed bg-opacity-60 flex items-center justify-center top-0 left-0 right-0 bottm-0 z-50'
    onClick={onClose}
    >
        <div onClick = {(event) => event.stopPropagation()} 
        className=' bg-white w-[600px] h-[400px] max-w-full flex flex-col relative p-4 rounded-xl'>
            <AiOutlineClose className = "absoulte right-6 top-6 text-3xl text-red-600 cursor-pointer " onClick={onClose}/>
            <h2 className=' w-fit px-4 py-1 rounded-lg bg-red-300 '>{book.publishYear}</h2>
            <h2 className='my-2 text-gray-500'>{book.id}</h2>
            <div className='flex justify-start item-center gap-x-2 '>
                <PiBookOpenText className='text-2xl text-red-300'/>
                <h2 className='my-1'>{book.title}</h2>
            </div>
            <div className='flex justify-start item-center gap-x-2'>
                <BiUserCircle className='text-2xl text-red-300'/>
                <h2 className='my-1'>{book.author}</h2>
            </div>
            <p className='mt-4'>Do you want to kno how good improving</p>
            <p className='my-2'> Lorem ipsum dolor, sit amet consectetur adipisicing elit. 
                Quidem eveniet perferendis unde quas ducimus numquam repudiandae 
                debitis quisquam! Velit sint ea autem molestiae mollitia facere quasi 
                inventore doloribus vel similique!
            </p>
            
        </div>
      
    </div>
  )
}

export default BookModal;
