import React from 'react';

const DeleteInterview = async ({ params }) => {
  const interviewId = await params.interviewId;
  if (!interviewId) return <div>No Interview Found</div>;
  return <div className='bg-red-500'>{interviewId}</div>;
};

export default DeleteInterview;
