import Swal from "sweetalert2";

const AlertMessage = {
    // ConfirmDelete AlertMessage
    confirmDelete(
        title = "Are you sure?",
        text = "This action cannot be undone!"
    ) {
        return Swal.fire({
            title: title,
            text: text,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            return result; // Return the result to be used outside
        });
    },
    success(message = "Action completed successfully!") {
        Swal.fire({
            title: "Success",
            text: message,
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
        });
    },
    error(message = "Something went wrong!") {
        Swal.fire({
            title: "Error",
            text: message,
            icon: "error",
            timer: 2000,
            showConfirmButton: false,
        });
    },

    warning(message = "Warning! Please check your input.") {
        Swal.fire({
            title: "Warning",
            text: message,
            icon: "warning",
            timer: 2000,
            showConfirmButton: false,
        });
    },
};

export default AlertMessage;
