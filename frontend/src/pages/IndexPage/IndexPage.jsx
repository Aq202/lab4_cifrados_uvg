import React from 'react';
import useToken from '@hooks/useToken';
import HomePage from '../HomePage/HomePage';

function IndexPage() {
  const token = useToken();
  let page = "Login page";
  if (token) {
    page = <HomePage/>;
  }  
  return (
    <>
      {page}
    </>
  );
}

export default IndexPage;
