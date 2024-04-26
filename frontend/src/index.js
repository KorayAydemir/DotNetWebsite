const products = [
    {
        name: "iPhone 9",
        price: 549,
        img: "/images/ow_logo.svg",
        id: 1
    },
    {
        name: "iPhone 10",
        price: 649,
        img: "/images/ow_logo.svg",
        id: 2
    },
    {
        name: "iPhone 11",
        price: 749,
        img: "/images/ow_logo.svg",
        id: 3
    },
    {
        name: "iPhone 12",
        price: 849,
        img: "/images/ow_logo.svg",
        id: 4
    },
    {
        name: "iPhone 13",
        price: 949,
        img: "/images/ow_logo.svg",
        id: 5
    },
]

const getProductHtml = ({ name, price, img, id }) => {
    return `
    <div
        class="flex flex-col justify-self-center w-[16rem] xl:w-[21rem] 2xl:w-[25rem]"
    >
        <div
            class="bg-black w-full h-[12rem] xl:h-[16rem] 2xl:h-[18rem] flex items-center justify-center relative group"
        >
            <img
                alt="logo"
                loading="lazy"
                width="86"
                height="26"
                decoding="async"
                data-nimg="1"
                style="color: transparent"
                src="${img}"
            />
            <button
                data-product-id=${id}
                class="text-white absolute bottom-6 right-6 bg-slate-800 p-2 rounded-md group-hover:flex hidden hover:cursor-pointer hover:bg-slate-900 border-2 border-slate-800 add-to-basket"
            >
                <span>Add to basket</span>
                <svg
                    stroke="currentColor"
                    fill="currentColor"
                    stroke-width="0"
                    viewBox="0 0 24 24"
                    class="my-auto ml-2 text-lg"
                    height="1em"
                    width="1em"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        fill="none"
                        d="M0 0h24v24H0zm18.31 6l-2.76 5z"
                    ></path>
                    <path
                        d="M11 9h2V6h3V4h-3V1h-2v3H8v2h3v3zm-4 9c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2zm-9.83-3.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.86-7.01L19.42 4h-.01l-1.1 2-2.76 5H8.53l-.13-.27L6.16 6l-.95-2-.94-2H1v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.13 0-.25-.11-.25-.25z"
                    ></path>
                </svg>
            </button>
        </div>
        <span class="text-red-400">Just In</span
        ><span class="text-slate-100 font-bold"
            >${name}</span
        ><span class="text-slate-200 text-sm"
            >smartphones</span
        ><span class="font-bold text-slate-100 mt-3"
            >Price: ${price}$</span
        >
    </div>
`
}

const createLocalStorageItemsIfNotExist = (items) => {
    for (const [key, value] of Object.entries(items)) {
        const localStorageItem = localStorage.getItem(key);

        if (!localStorageItem) {
            localStorage.setItem(key, JSON.stringify(value));
        }
    }
}

const updateLocalStorageItem = (key, func) => {
    const localStorageItem = JSON.parse(localStorage.getItem(key));
    const updatedItem = func(localStorageItem)
    localStorage.setItem(key, JSON.stringify(updatedItem));

    return updatedItem;
}

const getBasketHtml = ({ name, price, img, amount, id }) => {
    return `
    <li class="mt-5" id=${id}>
        <div>
            <h2>${name}</h2>
            <div class="flex justify-between">
            <span>${price} TL</span><span>Amount: ${amount}</span>
            </div>
        </div>
        <div class="mt-2">
            <button
                class="bg-red-800 px-2 border-2 rounded-md font-bold mr-4 decrement-amount"
                data-product-id=${id}
            >
                −</button
            ><button
                class="bg-green-800 px-2 border-2 rounded-md font-bold increment-amount"
                data-product-id=${id}
            >
                +
            </button>
        </div>
    </li>
    `
}

const closeBasket = () => {
    const basketModal = document.getElementById('basket-modal');
    const backdrop = document.getElementById('backdrop');
    basketModal.classList.add('hidden');
    backdrop.classList.add('hidden');
}
const openBasket = () => {
    const basketModal = document.getElementById('basket-modal');
    const backdrop = document.getElementById('backdrop');
    basketModal.classList.remove('hidden');
    backdrop.classList.remove('hidden');
}


const incrementBasketItemAmount = (itemId) => {
    updateLocalStorageItem('basket', (basket) => {
        const product = basket.find(product => product.id === parseInt(itemId));
        product.amount += 1;
        return basket;
    })
    updateLocalStorageItem('basketAmount', (basketAmount) => {
        return basketAmount + 1;
    })

    renderBasketItems();
    renderBasketAmount();
}

const decrementBasketItemAmount = (itemId) => {
    updateLocalStorageItem('basket', (basket) => {
        const product = basket.find(product => product.id === parseInt(itemId));
        product.amount -= 1;
        if (product.amount === 0) {
            return basket.filter(product => product.id !== parseInt(itemId));
        }
        return basket;
    })
    updateLocalStorageItem('basketAmount', (basketAmount) => {
        return basketAmount - 1;
    })

    renderBasketItems();
    renderBasketAmount();
}

// ON MOUNT
const productsAsHtml = products.map(getProductHtml).join('');
document.getElementById('products').innerHTML = productsAsHtml

const calculateTotalPrice = () => {
    const totalPriceText = document.getElementById('total-price');
    const basket = JSON.parse(localStorage.getItem('basket'));
    if (!basket) {
        totalPriceText.innerText = '0$';
        return;
    }
    const totalPrice = basket.reduce((acc, product) => {
        return acc + product.price * product.amount;
    }, 0)

    totalPriceText.innerText = `${totalPrice}$`;
}

const renderBasketItems = () => {
    const basket = JSON.parse(localStorage.getItem('basket'));
    if (!basket) {
        document.getElementById('basket-products').innerHTML = '';
        return;
    } 
    document.getElementById('basket-products').innerHTML = basket.map(getBasketHtml).join('');

    const incrementButtons = document.getElementsByClassName('increment-amount');
    const decrementButtons = document.getElementsByClassName('decrement-amount');
    for (button of incrementButtons) {
        button.addEventListener('click', (event) =>
            incrementBasketItemAmount(event.currentTarget.dataset.productId)
        )
    }

    for (button of decrementButtons) {
        button.addEventListener('click', (event) =>
            decrementBasketItemAmount(event.currentTarget.dataset.productId)
        )
    }

    calculateTotalPrice();
}

const renderBasketAmount = () => {
    document.getElementById('basket-number').innerText = JSON.parse(localStorage.getItem('basketAmount')) || 0;
}

renderBasketItems();
renderBasketAmount();

// EVENTS
const addToBasketButtons = document.getElementsByClassName('add-to-basket');
for (button of addToBasketButtons) {
    button.addEventListener('click', (event) => {
        const updateBasketAmount = (newAmount) => {
            document.getElementById('basket-number').innerText = newAmount;
        }
        const addToLocalStorageBasket = (product) => {
            createLocalStorageItemsIfNotExist({
                basket: [],
                basketAmount: 0
            })

            updateLocalStorageItem('basket', (basket) => {
                const productAlreadyInBasket = basket.find(basketProduct => basketProduct.id === product.id);
                if (productAlreadyInBasket) {
                    productAlreadyInBasket.amount += 1;
                } else {
                    product.amount = 1;
                    basket.push(product);
                }

                return basket;
            })

            const basketAmount = updateLocalStorageItem('basketAmount', (basketAmount) => {
                return basketAmount + 1;
            })
            return basketAmount;
        }

        const productId = event.currentTarget.dataset.productId
        const product = products.find(product => product.id === parseInt(productId));

        const newBasketAmount = addToLocalStorageBasket(product);
        updateBasketAmount(newBasketAmount);
        renderBasketItems()
    })
}

document.getElementById('close-basket').addEventListener('click', closeBasket);
document.getElementById('backdrop').addEventListener('click', closeBasket);
document.getElementById('show-basket').addEventListener('click', openBasket);

document.getElementById('clear-basket').addEventListener('click', () => {
    localStorage.removeItem('basket');
    localStorage.removeItem('basketAmount');
    renderBasketItems();
    renderBasketAmount();
})


// scrapped idea
//const body = document.body;
//body.addEventListener('click', (event) => {
//    const targets = ['close-basket', 'backdrop', 'show-basket']
//
//    let foundTarget;
//    for (const target of targets) {
//        if (event.target.id === target) {
//            foundTarget = event.target;
//            break;
//        }
//
//        const parentTarget = event.target.closest(`#${target}`) 
//        if (parentTarget) {
//            foundTarget = parentTarget;
//            break;
//        }
//    }
//
//    switch (foundTarget?.id) {
//        case 'close-basket':
//        case 'backdrop':
//            const basketModal = document.getElementById('basket-modal');
//            basketModal.classList.add('hidden');
//            break;
//        case 'show-basket':
//            const basketModal = document.getElementById('basket-modal');
//            basketModal.classList.remove('hidden');
//            break;
//        default: // null
//            break;
//    }
//})
