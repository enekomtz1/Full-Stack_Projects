/*
- Initializes a hook to manage image URL state and provide an image preview functionality.
- Uses FileReader to convert an image file into a Data URL for preview.
- Provides validation to ensure only image files are processed.
- Utilizes a custom hook `useShowToast` to display error messages for invalid files.
*/

import { useState } from "react";
import useShowToast from "./useShowToast";

const usePreviewImg = () => {
	// State to store the image URL for preview
	const [imgUrl, setImgUrl] = useState(null);

	// Custom hook to show toast notifications
	const showToast = useShowToast();

	// Handles changes to the file input field
	const handleImageChange = (e) => {
		const file = e.target.files[0]; // Extract the first file from the file input

		// Check if the file is an image
		if (file && file.type.startsWith("image/")) {
			const reader = new FileReader(); // Initialize a FileReader to read the file

			// Set up the reader to update imgUrl state when the file is read
			reader.onloadend = () => {
				setImgUrl(reader.result);
			};

			reader.readAsDataURL(file); // Start reading the file as a Data URL
		} else {
			// Show error toast and reset imgUrl if file is not an image
			showToast("Invalid file type. Please select an image file.", "error");
			setImgUrl(null);
		}
	};

	return { handleImageChange, imgUrl, setImgUrl };
};

export default usePreviewImg;
