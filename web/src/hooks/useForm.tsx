import { useEffect, useState } from 'react';

type EventType = {
  target: {
    value: string | number;
    type: string | number;
    name: string;
  };
};

const useForm = (initial: object = {}) => {
  const [inputs, setInputs] = useState<any>(initial);
  // const initialValues = Object.values(initial).join('');

  useEffect(() => {
    setInputs(initial);
  }, [initial]);

  function handleChange(e: EventType) {
    let { value, type, name } = e.target;
    if (type === 'number') {
      value = Number(value);
    }
    setInputs({
      ...inputs,
      [name]: value,
    });
  }

  function resetForm() {
    setInputs(initial);
  }

  function clearForm() {
    const blankState = Object.fromEntries(
      Object.entries(inputs).map((key) => [key, ''])
    );
    setInputs(blankState);
  }

  return {
    inputs,
    handleChange,
    resetForm,
    clearForm,
  };
};

export default useForm;
