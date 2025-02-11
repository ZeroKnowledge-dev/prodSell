<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CategoryController extends Controller {
	public function CategoryPage() {
		return Inertia::render('CategoryPage');
	}

	function CategoryList(Request $request) {
		$user_id = $request->header('id');
		return Category::where('user_id', $user_id)->get();
	}

	function AddCategory(Request $request) {
		$user_id = $request->header('id');
		return Category::create([
			'name'    => $request->input('name'),
			'user_id' => $user_id,
		]);
	}

	function DeleteCategory(Request $request) {
		$category_id = $request->input('id');
		$user_id     = $request->header('id');
		return Category::where('id', $category_id)->where('user_id', $user_id)->delete();
	}

	function UpdateCategory(Request $request) {
		$category_id = $request->input('id');
		$user_id     = $request->header('id');
		return Category::where('id', $category_id)->where('user_id', $user_id)->update([
			'name' => $request->input('name'),
		]);
	}

	function CategoryByID(Request $request) {
		$category_id = $request->input('id');
		$user_id     = $request->header('id');
		return Category::where('id', $category_id)->where('user_id', $user_id)->first();
	}
}
