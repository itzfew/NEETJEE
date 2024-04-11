<?php
if ($_FILES['file']['error'] === UPLOAD_ERR_OK) {
  $fileTmpPath = $_FILES['file']['tmp_name'];
  $fileName = $_FILES['file']['name'];
  $fileType = $_FILES['file']['type'];
  $fileSize = $_FILES['file']['size'];
  $fileUploadPath = 'uploads/' . $fileName;

  // Move uploaded file to destination
  if (move_uploaded_file($fileTmpPath, $fileUploadPath)) {
    // Send email to admin with file attached
    $to_owner = 'contactus94@yahoo.com';
    $subject_owner = 'New file uploaded';
    $message_owner = 'A new file has been uploaded by a user.';
    $headers_owner = 'From: challawaheed@gmail.com' . "\r\n" .
               'Reply-To: challawaheed@gmail.com' . "\r\n" .
               'X-Mailer: PHP/' . phpversion();

    // Attach file
    $fileContent = file_get_contents($fileUploadPath);
    $attachment = chunk_split(base64_encode($fileContent));
    $boundary = md5(date('r', time()));
    $headers_owner .= "\r\nMIME-Version: 1.0\r\nContent-Type: multipart/mixed; boundary=\"_1_$boundary\"";
    $message_owner = "--_1_$boundary\r\n" .
               "Content-Type: multipart/alternative; boundary=\"_2_$boundary\"\r\n" .
               "\r\n" .
               "--_2_$boundary\r\n" .
               "Content-Type: text/plain; charset=\"UTF-8\"\r\n" .
               "Content-Transfer-Encoding: 7bit\r\n" .
               "\r\n" .
               $message_owner . "\r\n" .
               "--_2_$boundary--\r\n" .
               "--_1_$boundary\r\n" .
               "Content-Type: application/octet-stream; name=\"$fileName\"\r\n" .
               "Content-Transfer-Encoding: base64\r\n" .
               "Content-Disposition: attachment\r\n" .
               "\r\n" .
               $attachment . "\r\n" .
               "--_1_$boundary--";
    
    // Send email to admin
    mail($to_owner, $subject_owner, $message_owner, $headers_owner);

    // Send email to user
    $to_user = 'challawaheed@gmail.com';
    $subject_user = 'File upload confirmation';
    $message_user = 'Your file has been successfully uploaded. Thank you!';
    $headers_user = 'From: contactus94@yahoo.com' . "\r\n" .
               'Reply-To: contactus94@yahoo.com' . "\r\n" .
               'X-Mailer: PHP/' . phpversion();
    
    mail($to_user, $subject_user, $message_user, $headers_user);

    echo json_encode(['success' => true]);
  } else {
    echo json_encode(['success' => false]);
  }
} else {
  echo json_encode(['success' => false]);
}
?>
