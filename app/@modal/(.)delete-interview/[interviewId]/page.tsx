import { Modal } from '@/components/Modal';

export default async function DeleteModal({
  params,
}: {
  params: Promise<{ interviewId: string }>;
}) {
  const interviewId = (await params).interviewId;
  if (!interviewId) return <div>No Interview Found</div>;
  return (
    <Modal>
      <div>Are you sure you want to delete this?</div>
    </Modal>
  );
}
