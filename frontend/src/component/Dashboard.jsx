
import React from 'react'
const DashBoard = () => {
    return (
        <div>
            <nav className='flex flex-wrap items-center justify-between bg-white shadow px-4 py-3'>

                <a className='text-xl font-bold text-green-700' href="#">Annadhara</a>
                <form>
                    <input type="search" placeholder='Search Product' className='  w-full border rounded-md px-3 py-1 focus:outline-none focus:ring-2 size-full focus:ring-green-500' />
                </form>
                <ul className='flex space-x-4 text-sm font-bold text-orange-600'>
                    <li><a className='hover:text-green-700' href="#">Crops</a></li>
                    <li><a  className='hover:text-green-700'href="#">Vegetable</a></li>
                    <li><a className='hover:text-green-700' href="#">Fruites</a></li>
                    <li><a className='hover:text-green-700' href="#">Nursery &Plants</a></li>
                    <li><a className='hover:text-green-700' href="#">Organic</a></li>
                    <li><a  className='hover:text-green-700'href="#">Dry Fruits</a></li>
                </ul>
            <div className='flex space-x-2'>
                
                <button className='bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600'>Seller</button>
                <button  className=' bg-green-500 text-white border px-4 py-1 rounded hover:text-white hover:bg-green-600' >
                    <b>
                        Login  
                        </b>
                </button>
                <button  className=' bg-green-500 text-white border px-4 py-1 rounded hover:text-white hover:bg-green-600' >
                    <b>
                         SignPage
                        </b>
                </button>
                </div>
            </nav>
            <div className='text-center py-10 bg-green-50 '>
           
                    <h2 className='text-3xl font-bold text-green-700 mb-2'>Annadhara is India's Largest Marketplace<br /> For Selling and Buying<b> Crops </b></h2>
                    <p className='text-gray-600 mb-4'>Connect directly with farmers, suppliers, and buyers accross India. Get the best proces for quality agricultural products.</p>
                    <button className='bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700'>Start Trading Now </button>
                </div>
            
            <div className='px-4 py-6'>
                <h4 className='text-xl font-semibold text-green-800 mb-4'>
                    Product Buy & Sell
                </h4>
                <div>
                    (Product cards go here)
                </div>
            </div>
        </div>
    )
}

export default DashBoard