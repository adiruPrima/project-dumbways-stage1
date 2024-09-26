function sendEmail(event) {
  event.preventDefault();

  const inputName = document.getElementById("name").value;
  const inputEmail = document.getElementById("email").value;
  const inputPhone = document.getElementById("phone").value;
  const inputSubject = document.getElementById("subject").value;
  const inputMessage = document.getElementById("message").value;

  const encodedMessage = encodeURIComponent(inputMessage);

  const contact = {
    name: inputName,
    email: inputEmail,
    phone: inputPhone,
    subject: inputSubject,
    message: inputMessage,
  };

  if (!inputName) {
    return alert("Name cannot be empty");
  } else if (!inputEmail) {
    return alert("Email cannot be empty");
  } else if (!inputPhone) {
    return alert("Phone number cannot be empty");
  } else if (!inputSubject) {
    return alert("Subject cannot be empty");
  } else if (!inputMessage) {
    return alert("Message cannot be empty");
  }

  // alert(
  //   `Message successfully sent! \n\nName: ${inputName} \nEmail: ${inputEmail} \nPhone number: ${inputPhone} \nSubject: ${inputSubject} \nMessage: ${inputMessage}`
  // );

  const link = document.createElement("a");
  link.href = `mailto:john.doe@gmail.com?subject=${inputSubject}&body=${encodedMessage}%0A%0AName:%20${inputName}%0AEmail:%20${inputEmail}%0APhone%20number:%20${inputPhone}`;

  link.click();
  console.log(contact);
}
