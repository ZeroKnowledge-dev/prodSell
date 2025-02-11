<?php

namespace App\Http\Controllers;

use App\Helper\JWTToken;
use App\Mail\OTPMail;
use App\Models\User;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class UserController extends Controller {
	public function RegistrationPage() {
		return Inertia::render('RegistrationPage');
	}

	public function LoginPage() {
		return Inertia::render('LoginPage');
	}

	public function ForgotPasswordPage() {
		return Inertia::render('ForgotPasswordPage');
	}

	public function ResetPasswordPage() {
		return Inertia::render('ResetPasswordPage');
	}

	public function OTPVerificationPage() {
		return Inertia::render('VerifyOtpPage');
	}

	public function ProfilePage() {
		return Inertia::render('ProfilePage');
	}

	public function UserRegistration(Request $request) {
		try {

			User::create([
				'firstName' => $request->input('firstName'),
				'lastName'  => $request->input('lastName'),
				'email'     => $request->input('email'),
				'phone'     => $request->input('phone'),
				'password'  => $request->input('password'),
			]);

			return response()->json([
				'status'  => 'success',
				'message' => 'User registration successful!',
			], 200);
		} catch (Exception $e) {
			return response()->json([
				'status'  => 'Failed',
				'message' => 'User registration failed!',
			]);
		}
	}

	public function UserLogin(Request $request) {
		$count = User::where([
			'email'    => $request->input('email'),
			'password' => $request->input('password'),
		])->select('id')->first();

		if ($count !== null) {
			// User Login Success -> JWT Token issue
			$token = JWTToken::CreateToken($request->input('email'), $count->id);
			return response()->json([
				'status'  => 'success',
				'message' => 'User login successfully!',
			], 200)->cookie('token', $token, time() + 60 * 24 * 30);
		} else {
			return response()->json([
				'status'  => 'Failed',
				'message' => 'Unauthorized access!',
			], 401);
		}
	}

	function SendOtpCOde(Request $request) {
		$email = $request->input('email');
		$otp   = rand(1000, 9999);
		$count = User::where('email', '=', $email)->count();
		if ($count == 1) {
			//OTP Mail Send
			Mail::to($email)->send(new OTPMail($otp));
			// OTP Code Insert Table
			User::where('email', '=', $email)->update(['otp' => $otp]);
			return response()->json([
				'status'  => 'success',
				'message' => 'OTP sent successfully!',
			], 200);
		} else {
			return response()->json([
				'status'  => 'Failed',
				'message' => 'Invalid email!',
			], 401);
		}
	}

	function VerifyOtpCOde(Request $request) {
		$email = $request->input('email');
		$otp   = $request->input('otp');
		$count = User::where('email', '=', $email)
			->where('otp', '=', $otp)->count();

		if ($count == 1) {
			// Database OTP Update
			User::where('email', '=', $email)->update(['otp' => '0']);

			// Pass Reset Token Issue
			$token = JWTToken::CreateTokenForSetPassword($request->input('email'));
			return response()->json([
				'status'  => 'success',
				'message' => 'OTP Verification Successful',
			], 200)->cookie('token', $token, 60 * 24 * 30);

		} else {
			return response()->json([
				'status'  => 'failed',
				'message' => 'unauthorized',
			], 401);
		}
	}

	function ResetPassword(Request $request) {
		try {
			$email    = $request->header('email');
			$password = $request->input('password');

			User::where('email', '=', $email)->update(['password' => $password]);

			return response()->json([
				'status'  => 'success',
				'message' => 'Password reset successfully!',
			], 200);
		} catch (Exception $e) {
			return response()->json([
				'status'  => 'Failed',
				'message' => $e->getMessage(),
			], 401);
		}
	}

	function UserLogout() {
		return redirect('/login')->cookie('token', '', -1);
	}

	function UserProfile(Request $request) {
		$email = $request->header('email');
		$user  = User::where('email', '=', $email)->first();
		return response()->json([
			'status'  => 'success',
			'message' => 'Request successful!',
			'data'    => $user,
		], 200);
	}

	function UpdateProfile(Request $request) {
		try {
			$email     = $request->header('email');
			$firstName = $request->input('firstName');
			$lastName  = $request->input('lastName');
			$phone     = $request->input('phone');
			$password  = $request->input('password');

			User::where('email', '=', $email)->update([
				'firstName' => $firstName,
				'lastName'  => $lastName,
				'phone'     => $phone,
				'password'  => $password,
			]);

			return response()->json([
				'status'  => 'success',
				'message' => 'Profile updated successfully!',
			], 200);
		} catch (Exception $e) {
			return response()->json([
				'status'  => 'Failed',
				'message' => 'Something Went Wrong',
			], 401);
		}
	}
}
