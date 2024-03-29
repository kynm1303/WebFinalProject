$('#txtDOB').datetimepicker({
	format: 'd/m/Y',
	timepicker: false,
	mask: true
});
function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

$('#frmRegister').on('submit', function (e) {
	e.preventDefault();

	// check for empty value
	var valuecheck = $('#txtUsername').val();
	if (valuecheck.length === 0) {
		// alert('Invalid data.');
		$('#txtUsername').focus();
		$('#UsernameHelp').text('Username must not be blank')
		// console.log("name null");
		return;
	}
	$('#UsernameHelp').text('')
	valuecheck = $('#txtPassword').val();
	if (valuecheck.length === 0) {
		// alert('Invalid data.');
		$('#txtPassword').focus();
		$('#PasswordHelp').text('Password must not be blank')
		// console.log("name null");
		return;
	}
	$('#PasswordHelp').text('')
	valuecheck = $('#txtConfirm').val();
	if (valuecheck.length === 0) {
		// alert('Invalid data.');
		$('#txtConfirm').focus();
		$('#ConfirmHelp').text('Confirm must not be blank')
		// console.log("name null");
		return;
	}	
	$('#ConfirmHelp').text('')
	valuecheck = $('#txtName').val();
	if (valuecheck.length === 0) {
		// alert('Invalid data.');
		$('#txtName').focus();
		$('#NameHelp').text('Name must not be blank')
		// console.log("name null");
		return;
	}
	$('#NameHelp').text('')
	valuecheck = $('#txtEmail').val();
	if (valuecheck.length === 0) {
		// alert('Invalid data.');
		$('#txtEmail').focus();
		$('#EmailHelp').text('Email must not be blank')
		// console.log("name null");
		return;
	}
	$('#EmailHelp').text('')
	//END check for empty value

	//START check for password and confirm
	if ($('#txtPassword').val() != $('#txtConfirm').val()){
		// alert('not match');
		$('#ConfirmHelp').text('Password and Confirm don\'t match')
		return;
	}
	$('#ConfirmHelp').text('')
	//END check for password and confirm

	//START check for email format
	valuecheck = $('#txtEmail').val();
	if (!validateEmail(valuecheck)){
		// alert("email not match format");
		$('#EmailHelp').text('Email must have right format')
		return;
	}
	$('#EmailHelp').text('')
	//END check for email format
	const username = $('#txtUsername').val();
	$.getJSON(`/account/is-available?user=${username}`, function (data) {
		if (data === false) {
			Swal.fire({
				icon: 'error',
				title: 'Error!!!',
				text: 'User not available!',
			})
		} else {
			const captcha = document.querySelector('#g-recaptcha-response').value;
			if (!captcha){
				Swal.fire({
					icon: 'error',
					title: 'Lỗi xảy ra!!!',
					text: 'Mời bạn nhập captcha!',
				})
				return
			}
			const raw_dob = $('#txtDOB').val();
			$.ajax({
				url: location.protocol + '//' + location.host + '/account/register',
				method: "post",
				data: jQuery.param({
					username : $("#txtUsername").val(),
					raw_password : $("#txtPassword").val(),
					name : $('#txtName').val(),
					email : $('#txtEmail').val(),
					captcha,
					raw_dob : $('#txtDOB').val(),
				}),
				success: function(data){
					console.log(data)
					if (data.success){
						Swal.fire({
							icon: 'success',
							title: 'Bạn đã đăng ký thành công',
							confirmButtonText: 'Đăng nhập'
						}).then(result => {
							if (result.isConfirmed) {
								window.location.replace(location.protocol + '//' + location.host + '/account/login')
							}
						})
					}
					else {
						Swal.fire({
							icon: 'error',
							title: 'Lỗi xảy ra!',
							text: data.msg,
						})
					}
				},
				error: function(jqXHR, textStatus, errorThrown){
					Swal.fire({
						title: 'Lỗi xảy ra!',
						text: textStatus + " " + errorThrown,
						icon: 'error',
						confirmButtonText: 'Xác nhận'
					})
				}
			})
		}
	});
});

$('#txtUsername').focus();