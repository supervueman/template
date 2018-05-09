<?php
$admin_email = "daily@buseedo.com, chaogen2@gmail.com";
function adopt($text) {
	return '=?UTF-8?B?'.Base64_encode($text).'?=';
}
function validMail($mail) {
	if(preg_match('/^([a-z0-9_\.-])+@[a-z0-9-]+\.([a-z]{2,4}\.)?[a-z]{2,4}$/i', $mail)) { return true; }
}

function renameField($fieldName) {
	$fieldNames = [
		"name" => "Name",
		"form" => "Form",
		"email" => "E-mail",
		"course" => "Course"
	];
	$curValue = "Unknown field";
	foreach ($fieldNames as $key => $value) {
		$curValue = ($key == $fieldName) ? $value : $curValue;
	}
	return $curValue;
}

$form_subject = "Application form - \"" . $_POST['form'] . "\"";
$form_mail = " ";
foreach ($_POST as $key => $value) {
	if ($value != ""  && $key != "form") {
		if($key == "email") $form_mail = $value;
		$message .= '
		<tr style="background-color:#f8f8f8;"><td style="padding:10px;border:#e9e9e9 1px solid;">
		<b>' . renameField($key) . '</b></td><td style="padding:10px;border:#e9e9e9 1px solid;">' . $value . '</td></tr>
		';
	}
}
$message = "<table style='width: 100%;'>$message</table>";
$headers = "MIME-Version: 1.0" . PHP_EOL .
	"Content-Type: text/html; charset=utf-8" . PHP_EOL .
	'Reply-To: '.$admin_email.'' . PHP_EOL;
if($form_mail == " " || validMail($form_mail)) {
	if(mail($admin_email, adopt($form_subject), $message, $headers)) {
		// $admin_email = 'newadminmail@yandex.ru';
		// mail($admin_email, adopt($form_subject), $message, $headers);
	}

  /* И если у нас в форме был email обратной связи - высылаем на него письмо с подтверждением успешно оставленной на сайте заявки.
  */
		if ($form_mail != " ") {
			$form_subject = "Your application is accepted!";
			$message = '
				<span>Thank you for having left an application on our website. The specialist will answer you in the near future.</span><br>
      ';
			mail($form_mail, adopt($form_subject), $message, $headers);
		}
}
