import { AiOutlineEdit } from 'react-icons/ai';
import { BsInfoCircle } from 'react-icons/bs';
import { MdOutlineDelete } from 'react-icons/md';
import { Link } from 'react-router-dom';

const BookTable = ({ books }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-separate border-spacing-2">
        <thead>
          <tr>
            <th className="border border-slate-600 rounded-md p-2">No</th>
            <th className="border border-slate-600 rounded-md p-2">Title</th>
            <th className="border border-slate-600 rounded-md p-2">Author</th>
            <th className="border border-slate-600 rounded-md p-2 max-md:hidden">
              Publish Year
            </th>
            <th className="border border-slate-600 rounded-md p-2">Operations</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book, index) => (
            <tr key={book._id} className="h-8">
              <td className="border border-slate-600 rounded-md text-center p-2">
                {index + 1}
              </td>
              <td className="border border-slate-600 rounded-md text-left p-2">
                {book.title}
              </td>
              <td className="border border-slate-600 rounded-md text-left p-2">
                {book.author}
              </td>
              <td className="border border-slate-600 rounded-md text-center p-2 max-md:hidden">
                {book.publishYear}
              </td>
              <td className="border border-slate-600 rounded-md p-2">
                <div className="flex justify-center gap-x-4 flex-wrap max-md:gap-y-2">
                  <Link to={`/books/details/${book._id}`}>
                    <BsInfoCircle className="text-xl text-green-400" />
                  </Link>
                  <Link to={`/books/edit/${book._id}`}>
                    <AiOutlineEdit className="text-xl text-yellow-400" />
                  </Link>
                  <Link to={`/books/delete/${book._id}`}>
                    <MdOutlineDelete className="text-xl text-red-400" />
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BookTable;
