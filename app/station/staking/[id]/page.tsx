'use client';

import { useParams } from 'next/navigation';

const Details = () => {
  const params = useParams();
  const {id} = params;

  
  return (
    <div>
      Details for Validator ID: {id}
    </div>
  );
}

export default Details;