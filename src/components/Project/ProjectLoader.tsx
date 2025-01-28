type Props = {
  isLoading: boolean;
  isError: boolean;
  projectId: string;
};

export default function ProjectLoader({
  projectId,
  isLoading,
  isError,
}: Props) {
  if (isLoading) {
    return (
      <div
        className="h-64 w-full bg-white rounded-2xl shadow-lg
        overflow-hidden flex justify-center animate-pulse"
      />
    );
  }

  if (isError) {
    return <div>Error loading project</div>;
  }

  return <div>Cannot find project {projectId}</div>;
}
