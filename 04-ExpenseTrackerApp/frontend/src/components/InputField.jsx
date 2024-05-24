/*
- This code defines a functional React component called InputField.
- It renders a labeled input field that can be customized through props.
- The component accepts props for label, id, name, type, onChange event handler, and value.
- It applies specific styling to the label and input field for better UI consistency.
- The component is exported for use in other parts of the application.
*/

const InputField = ({ label, id, name, type = "text", onChange, value }) => {
    // Return a JSX element that represents the input field with a label
    return (
      <div>
        {/* Render a label for the input field */}
        <label htmlFor={id} className='block text-sm font-medium text-gray-700'>
          {label}
        </label>
        {/* Render the input field with various props and styles */}
        <input
          className='mt-1 p-2 w-full border rounded-md text-black focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300'
          id={id}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
        />
      </div>
    );
  };
  
  export default InputField;
  