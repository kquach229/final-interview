import { HashLoader } from 'react-spinners';

export const Loading = () => {
  return (
    <div className='flex mx-auto w-full h-screen'>
      <HashLoader className='text-5xl' />
    </div>
  );
};

export default Loading;
