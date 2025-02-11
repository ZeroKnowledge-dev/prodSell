<?php

namespace App\Http\Controllers;
use App\Models\Category;
use App\Models\Customer;
use App\Models\Invoice;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller {

	public function DashboardPage() {
		return Inertia::render('DashboardPage');
	}

	function Summary(Request $request): array {
		$user_id = $request->header('id');

		$product  = Product::where('user_id', $user_id)->count();
		$category = Category::where('user_id', $user_id)->count();
		$customer = Customer::where('user_id', $user_id)->count();
		$invoice  = Invoice::where('user_id', $user_id)->count();
		$total    = Invoice::where('user_id', $user_id)->sum('total');
		$vat      = Invoice::where('user_id', $user_id)->sum('vat');
		$payable  = Invoice::where('user_id', $user_id)->sum('payable');

		// Get Recent Activities
		$recentCustomer = Customer::where('user_id', $user_id)->latest()->first();
		$recentCategory = Category::where('user_id', $user_id)->latest()->first();
		$recentProduct  = Product::where('user_id', $user_id)->latest()->first();

		return [
			'product'        => $product,
			'category'       => $category,
			'customer'       => $customer,
			'invoice'        => $invoice,
			'total'          => round($total, 2),
			'vat'            => round($vat, 2),
			'payable'        => round($payable, 2),

			// Recent Activity Data
			'recentActivity' => [
				'customer' => $recentCustomer ? $recentCustomer->name : 'N/A',
				'category' => $recentCategory ? $recentCategory->name : 'N/A',
				'product'  => $recentProduct ? $recentProduct->name : 'N/A',
			],
		];
	}

}
