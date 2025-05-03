
import React from 'react'
const DashBoard = () => {
    return (
        <div className='min-h-screen bg-white font-sans'>
            <nav className='flex flex-wrap items-center justify-between bg-white shadow-md px-6 py-4'>

                <a className='text-3xl font-extrabold text-green-700' href="#">Annadhara</a>
                <form>
                    <input type="search" placeholder='Search Product' className='  w-full border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-green-500' />
                </form>
                <ul className='hidden lg:flex space-x-6 text-sm font-semibold text-orange-600'>
                    {["Crops", "Vegtable", "Fruits", "Nursery & Plants", "Dry Fruits", "Organic"].map((item, i) => (
                        <li key={i}> <a className='hover:text-green-700'>{item} </a>
                        </li>
                    ))}
                </ul>
                <div className='flex space-x-2'>
                    <button className='bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600'>Seller</button>
                    <button className=' bg-green-500 text-white border px-4 py-1 rounded hover:text-white hover:bg-green-600' ><b>Login</b></button>
                    <button className=' bg-green-600 text-white border px-4 py-1 rounded hover:text-white hover:bg-green-600' ><b>Sign</b></button>
                </div>
            </nav>

            <section className='bg-green-50 text-center py-14 px-4'>
                <h2 className='text-4xl font-extrabold text-green-700 mb-4'>Annadhara is Bharat Largest Marketplace <br />
                    <span className='text-green-800' >For Selling and Buying <b>Crops</b></span>
                </h2>
                <p className='text-gray-700 max-w-2xl mx-auto mb-6'>Connect Directly with Farmers, Suppliers,and Buyers Across Bharat.
                    Get the best prices for quality agricultural products.
                </p>
                <button className='bg-green-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-green-700 hover:text-orange-400'><b>Start Trading Now</b></button>  </section>

            <section className='px-6 py-8'>
                <h4 className='text-2xl font-semibold text-green-800 mb-6 text-center'>Products Available for Buy & Sell</h4>

                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
                    <div className='bg-white border rounded-lg shadow hover:shadow-lg translate p-4'>
                        <img src="https://tse1.mm.bing.net/th?id=OIP.xiUz_Jbw5AmGwgxTb6eeBgHaDO&pid=Api" alt="Products" className='rounded mb-3 w-full h-40 object-cover' />
                        <h4 className='font-bold text-green-700 text-lg mb-1'>Crop Name</h4>
                        <p className='text-sm text-gray-600'>Short description of the product goes here. </p>
                        <button className='mt-3 bg-gray-600 text-white w-full py-1.5 rounded hover:bg-green-600'>View Details</button>

                    </div>
                    <div className='bg-white border rounded-lg shadow hover:shadow-lg translate p-4'>
                        <img src="https://tse1.mm.bing.net/th?id=OIP.xO0Uv6v6Y97E5lmG6Ed4KQHaD-&pid=Api&P=0&h=180" alt="Products" className='rounded mb-3 w-full h-40 object-cover' />
                        <h4 className='font-bold text-green-700 text-lg mb-1'>Crop Name</h4>
                        <p className='text-sm text-gray-600'>Short description of the product goes here. </p>
                        <button className='mt-3 bg-gray-600 text-white w-full py-1.5 rounded hover:bg-green-600'>View Details</button>

                    </div>
                    <div className='bg-white border rounded-lg shadow hover:shadow-lg translate p-4'>
                        <img src="https://tse4.mm.bing.net/th?id=OIP.N-tlKWCo0DDhJVyZs6EaNAHaD6&pid=Api&P=0&h=180" alt="Products" className='rounded mb-3 w-full h-40 object-cover' />
                        <h4 className='font-bold text-green-700 text-lg mb-1'>Crop Name</h4>
                        <p className='text-sm text-gray-600'>Short description of the product goes here. </p>
                        <button className='mt-3 bg-gray-600 text-white w-full py-1.5 rounded hover:bg-green-600'>View Details</button>

                    </div>
                    <div className='bg-white border rounded-lg shadow hover:shadow-lg translate p-4'>
                        <img src="https://tse4.mm.bing.net/th?id=OIP.QqS2s2sEMTPklixZYMdYiwHaEo&pid=Api&P=0&h=180" alt="Products" className='rounded mb-3 w-full h-40 object-cover' />
                        <h4 className='font-bold text-green-700 text-lg mb-1'>Crop Name</h4>
                        <p className='text-sm text-gray-600'>Short description of the product goes here. </p>
                        <button className='mt-3 bg-gray-600 text-white w-full py-1.5 rounded hover:bg-green-600'>View Details</button>

                    </div>
                </div>

            </section>
            <footer className=' rounded bg-green-700 text-white text-center py-1 mt-10'>
                &copy; 2025 Anndhara. All right reserved.
            </footer>
        </div>
    )
}

export default DashBoard