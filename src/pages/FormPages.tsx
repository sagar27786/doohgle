import React from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import DataCollectionForm from '../components/forms/DataCollectionForm';

const FormPage: React.FC = () => {
  const { formType } = useParams<{ formType: string }>();
  const [searchParams] = useSearchParams();
  const cardTitle = searchParams.get('card');

  return (
    <DataCollectionForm 
      formType={formType || 'learn-more'} 
      cardTitle={cardTitle || undefined} 
    />
  );
};

export default FormPage;
