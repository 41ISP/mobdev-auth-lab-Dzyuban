import { Link, useParams } from "react-router-dom"
import Input from "../components/Input"
import Button from "../components/Button"
import { api } from "../api/api"
import { useState, useEffect } from "react"

const ItemDetail = () => {

    const { id } = useParams()

    const [item, setItem] = useState(null)

    useEffect (() => {
        const loadItem = async () => {try{const allItems = await api.getItems()
    const foundItem = allItems.find((i) => i.id == id)
    setItem(foundItem)
    } catch (error){
        console.error("Ошибка загрузки:", error)
    }}
        
    
    loadItem()
    }, [id])
    const handleBid = async (e) => {
        e.preventDefault()
        // Берем сумму из инпута и превращаем в число
        const bidAmount = Number(e.target.bidInput.value)
        if (!bidAmount) {
            alert("Введите сумму ставки")
            return
        }
         const currentPrice = item.highestBid || item.price
        if (bidAmount <= currentPrice) {
            alert(`Ваша ставка должна быть больше, чем ${currentPrice} ₽`)
            return
        }
        try {
            // Отправляем на сервер (замени makeBid на название из твоего api.js)
            await api.createBids(id, bidAmount) 
            
            // ОБНОВЛЯЕМ ЭКРАН: снова запрашиваем товар, чтобы увидеть новую ставку
            const allItems = await api.getItems()
            // find - метод, перебирает все элементы массива и возвращает первый элемент который удовлетворяет условию
            const foundItem = allItems.find((i) => i.id == id)
            setItem(foundItem)

            // Очищаем поле ввода
            e.target.bidInput.value = ""
            
            alert("Ставка успешно сделана! 🎉")
        } catch (error) {
            // Ловим ошибки от сервера (например, если нельзя ставить на свой товар)
            const errorMsg = error.response?.data?.error || error.response?.data?.message || "Ошибка при ставке"
            alert(errorMsg)
        }
    }
    if (!item) {
        return <div className="container">Загрузка товара...</div>
    }
    
    const itemDelete = async () => {
        // Спрашиваем подтверждение (защита от случайного клика)
        const isConfirmed = window.confirm("Вы уверены, что хотите удалить этот товар?")
        if (!isConfirmed) return

        try {
            // Вызываем функцию из api.js
            await api.deleteItem(id) 
            
            // Если сервер ответил успешно, уходим на главную
            navigate("/")
        } catch (error) {
            // Если сервер запретил (например, 403 или 400), показываем ошибку
            const errorMsg = error.response?.data?.error || error.response?.data?.message || "Упс! Ошибочка"
            alert(errorMsg) 
        }
    }

    
    return (
        <div className="container">

            <Link to={"/"}>← Вернуться к списку товаров</Link>

            <div className="item-detail">
                <div className="item-header">
                    <div>
                        {item.imageUrl &&<img src={item.imageUrl} className="item-image-large" />}
                    </div>

                    <div className="item-info">
                        <span className="item-status">{item.status}</span>
                            
                        <h1 className="item-title-large">{item.title}</h1>
                        <Button
                            onClick={itemDelete} 
                            style={{ backgroundColor: '#dc3545', color: 'white', padding: '8px 16px', marginTop: '10px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                            >
                        Удалить товар
                        </Button>
                        <div className="item-seller-info">
                            <div className="seller-avatar">TS</div>
                            <div className="seller-details">
                                <div className="seller-name">{item.username}</div>
                                <div className="seller-date">{item.createdAt}</div>
                            </div>
                        </div>

                        <div className="item-description-full">
                            {item.description}
                        </div>

                        <div className="price-section">
                            <div className="starting-price">Начальная цена:</div>
                            <div className="current-price">{item.price}</div>
                            <div className="highest-bid">Текущая ставка: {item.highestBid}</div>

                            <form className="bid-form" onSubmit={handleBid}>
                                <Input 
                                    type="number" 
                                    name= "bidInput"
                                    className="bid-input" 
                                    placeholder="Введите вашу ставку (мин. 70 001 ₽)"
                                    min={item.highestBid}
                                    step="100"
                                />
                                <Button type="submit" className="btn-bid">Сделать ставку</Button>
                            </form>
                        </div>

                    </div>
                </div>

                {/* <div className="bids-section">
                    <div className="bids-header">
                        <h2 className="bids-title">История ставок</h2>
                        <span className="bids-count">5</span>
                </div>

                    <div className="bids-list">
                        <div className="bid-item highest-bid-item">
                            <div className="bid-user">
                                <div className="bid-avatar">BB</div>
                                <div className="bid-details">
                                    <span className="bid-username">buyer_best</span>
                                    <span className="bid-time">2 часа назад</span>
                                </div>
                                <span className="highest-badge">🏆 Лидирует</span>
                            </div>
                            <div className="bid-amount">70 000 ₽</div>
                        </div>

                        <div className="bid-item">
                            <div className="bid-user">
                                <div className="bid-avatar">JD</div>
                                <div className="bid-details">
                                    <span className="bid-username">john_doe</span>
                                    <span className="bid-time">5 часов назад</span>
                                </div>
                            </div>
                            <div className="bid-amount">68 000 ₽</div>
                        </div>

                        <div className="bid-item">
                            <div className="bid-user">
                                <div className="bid-avatar">AL</div>
                                <div className="bid-details">
                                    <span className="bid-username">alice_tech</span>
                                    <span className="bid-time">1 день назад</span>
                                </div>
                            </div>
                            <div className="bid-amount">67 000 ₽</div>
                        </div>

                        <div className="bid-item">
                            <div className="bid-user">
                                <div className="bid-avatar">MK</div>
                                <div className="bid-details">
                                    <span className="bid-username">mike_k</span>
                                    <span className="bid-time">1 день назад</span>
                                </div>
                            </div>
                            <div className="bid-amount">66 000 ₽</div>
                        </div>

                        <div className="bid-item">
                            <div className="bid-user">
                                <div className="bid-avatar">ST</div>
                                <div className="bid-details">
                                    <span className="bid-username">sarah_tech</span>
                                    <span className="bid-time">2 дня назад</span>
                                </div>
                            </div>
                            <div className="bid-amount">65 500 ₽</div>
                        </div> */}
                    {/* </div> */}
                {/* </div> */}
            </div>
            

   
        </div>
    )
}

export default ItemDetail
