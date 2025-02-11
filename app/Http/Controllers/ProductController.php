<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreImage;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Inertia\Inertia;

class ProductController extends Controller {

	public function ProductPage() {
		return Inertia::render('ProductPage');
	}

	public function CreateProduct(StoreImage $request) {
		$user_id = $request->header('id');

		$imagePath = null;
		if ($request->hasFile('img_url')) {
			$image     = $request->file('img_url');
			$imageName = time() . '.' . $image->getClientOriginalExtension();
			$imagePath = $image->storeAs('images', $imageName, 'public');
		}

		// Save To Database
		Product::create([
			'name'        => $request->input('name'),
			'price'       => $request->input('price'),
			'unit'        => $request->input('unit'),
			'img_url'     => $imagePath,
			'category_id' => $request->input('category_id'),
			'user_id'     => $user_id,
		]);

		return;
	}

	function DeleteProduct(Request $request) {
		$user_id    = $request->header('id');
		$product_id = $request->input('id');
		$filePath   = $request->input('img_url');

		$fullPath = public_path('/storage/' . $filePath);
		if (File::exists($fullPath)) {
			File::delete($fullPath);
		}

		// Delete the product from the database if it matches the user_id and product_id
		return Product::where('id', $product_id)
			->where('user_id', $user_id)
			->delete();
	}

	function ProductByID(Request $request) {
		$user_id    = $request->header('id');
		$product_id = $request->input('id');
		return Product::where('id', $product_id)->where('user_id', $user_id)->first();
	}

	function ProductList(Request $request) {
		$user_id = $request->header('id');
		return Product::where('user_id', $user_id)->get();
	}

	function UpdateProduct(Request $request) {
		$user_id    = $request->header('id');
		$product_id = $request->input('id');

		if ($request->input('img_url') != $request->input('file_path')) {

			// Upload New File
			$image     = $request->file('img_url');
			$imageName = time() . '.' . $image->getClientOriginalExtension();
			$imagePath = $image->storeAs('images', $imageName, 'public');

			// Delete Old File
			$filePath = $request->input('file_path');
			$fullPath = public_path('/storage/' . $filePath);
			if (File::exists($fullPath)) {
				File::delete($fullPath);
			}

			// Update Product

			Product::where('id', $product_id)->where('user_id', $user_id)->update([
				'name'        => $request->input('name'),
				'price'       => $request->input('price'),
				'unit'        => $request->input('unit'),
				'img_url'     => $imagePath,
				'category_id' => $request->input('category_id'),
			]);

			return;

		} else {
			Product::where('id', $product_id)->where('user_id', $user_id)->update([
				'name'        => $request->input('name'),
				'price'       => $request->input('price'),
				'unit'        => $request->input('unit'),
				'category_id' => $request->input('category_id'),
			]);
			return;
		}
	}
}
