import React from 'react';
import SuperReactGist from 'super-react-gist';

interface GistProps {
  url?: string;
  id?: string;
  file?: string;
}

const Gist: React.FC<GistProps> = ({ url, id, file }) => {
  // If URL is provided, use it directly
  if (url) {
    return (
      <div className="my-6 rounded-lg overflow-hidden">
        <SuperReactGist url={url} file={file} />
      </div>
    );
  }

  // If ID is provided, construct the URL
  if (id) {
    const gistUrl = `https://gist.github.com/${id}`;
    return (
      <div className="my-6 rounded-lg overflow-hidden">
        <SuperReactGist url={gistUrl} file={file} />
      </div>
    );
  }

  return <div className="text-red-500">Error: Please provide either a Gist URL or ID</div>;
};

export default Gist;
