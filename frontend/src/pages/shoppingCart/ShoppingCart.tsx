import React, { useEffect, useState } from "react";
import styles from "./ShoppingCart.module.css";
import { MainLayout } from "../../layouts/mainLayout";
import { Row, Col, Affix, Spin } from "antd";
import { ProductList, PaymentCard } from "../../components";
import { useSelector, useAppDispatch } from "../../redux/hooks";
import { clearShoppingCartItem, checkout, getShoppingCart } from "../../redux/shoppingCart/slice";
import { getProductDetail } from "../../redux/productDetail/slice";
import { useNavigate } from "react-router-dom";

interface CartItem {
  checkOutDate: string;
  totalPrice: number;
  nights: number;
  roomTypeName: string;
  hotelId: string;
  checkInDate: string;
  roomTypeId: string;
  pricePerNight: number;
  itemKey: string;
}

interface Product {
  itemKey: string;
  RoomTypeName: string;
  roomTypeId: string;
  price: number;
  checkInDate: string;
  checkOutDate: string;
  nights: number;
  HotelName: string;
  HotelRating: string;
  cityName: string;
  Description: string;
  HotelFacilities: string;
  Attractions: string;
}

export const ShoppingCartPage: React.FC = () => {
  const loading = useSelector((s) => s.shoppingCart.loading);
  const shoppingCartItems = useSelector((s) => s.shoppingCart.items) as CartItem[];
  const jwt = useSelector((s) => s.user.token) as string;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const productLoading = useSelector((state) => state.productDetail.loading);

  const [productDetails, setProductDetails] = useState<Record<string, any>>({});
  const [loadingDetails, setLoadingDetails] = useState(true);

  useEffect(() => {
    if (jwt) {
      dispatch(getShoppingCart(jwt)); // 确保获取最新的购物车状态
    }
  }, [dispatch, jwt]);

  useEffect(() => {
    if (shoppingCartItems.length === 0) {
      setLoadingDetails(false); // 如果购物车为空，停止加载状态
      return;
    }

    const fetchProductDetails = async () => {
      setLoadingDetails(true);

      const promises = shoppingCartItems.map(async (item) => {
        if (!productDetails[item.hotelId]) {
          try {
            const actionResult = await dispatch(getProductDetail(item.hotelId)).unwrap();
            setProductDetails((prev) => ({
              ...prev,
              [item.hotelId]: actionResult,
            }));
          } catch (error) {
            console.error(`Failed to fetch details for hotelId ${item.hotelId}`, error);
          }
        }
      });

      await Promise.all(promises);
      setLoadingDetails(false);
    };

    fetchProductDetails();
  }, [dispatch, shoppingCartItems, productDetails]);

  if (loading || productLoading || loadingDetails) {
    return (
      <Spin
        size="large"
        style={{
          marginTop: 200,
          marginBottom: 200,
          marginLeft: "auto",
          marginRight: "auto",
          width: "100%",
        }}
      />
    );
  }

  const mergedShoppingCartData = shoppingCartItems.map((item, index) => {
    const hotel = productDetails[item.hotelId] || {};

    return {
      itemKey: item.itemKey || `${item.roomTypeId}-${item.checkInDate}`,
      RoomTypeName: item.roomTypeName,
      roomTypeId: item.roomTypeId,
      price: item.totalPrice,
      checkInDate: item.checkInDate,
      checkOutDate: item.checkOutDate,
      nights: item.nights,
      HotelName: hotel.HotelName || '',
      HotelRating: hotel.HotelRating || '',
      cityName: hotel.cityName || '',
      Description: `Check-in: ${item.checkInDate}, Check-out: ${item.checkOutDate}, Nights: ${item.nights}`,
      HotelFacilities: hotel.HotelFacilities || '',
      Attractions: hotel.Attractions || '',
    };
  });

  const isCartEmpty = mergedShoppingCartData.length === 0;

  const handleCheckout = async () => {
    if (shoppingCartItems.length <= 0) {
      return;
    }

    try {
      await dispatch(checkout(jwt)).unwrap();
      await dispatch(getShoppingCart(jwt));
      navigate("/booking", {
        state: {
          products: mergedShoppingCartData, // 只传递购物车中的Item信息
        },
      });
    } catch (error) {
      console.error("Checkout failed:", error);
    }
  };

  // 更新 Clear 逻辑以使用单个 itemKey
  const handleDeleteItem = async (itemKey: string) => {
    try {
      await dispatch(clearShoppingCartItem({ jwt, itemKey })).unwrap(); // 传递单个 itemKey
      await dispatch(getShoppingCart(jwt));
    } catch (error) {
      console.error("Failed to remove item:", error);
    }
  };

  const handleClearCart = async () => {
    try {
      // 清空购物车的逻辑，这里可以使用 checkout 或调用后端的清空接口
      await dispatch(checkout(jwt)).unwrap(); // 假设清空购物车也通过 checkout 完成
      await dispatch(getShoppingCart(jwt)); // 重新获取购物车状态，确保清空后购物车状态更新
    } catch (error) {
      console.error("Failed to clear cart:", error);
    }
  };

  return (
    <MainLayout>
      <Row>
        {/* 购物车清单 */}
        <Col span={16}>
          <div className={styles["product-list-container"]}>
              {!isCartEmpty ? (
                <ProductList
                  data={mergedShoppingCartData}
                  onDelete={handleDeleteItem} // 传递单个 itemKey 给 handleDeleteItem
                />
              ) : (
                <div>No products in the shopping cart.</div>  // 当购物车为空时，显示占位文本
              )}
            </div>
        </Col>
        {/* 支付卡组件 */}
        <Col span={8}>
          <Affix>
            <div className={styles["payment-card-container"]}>
              <PaymentCard
                loading={loading}
                price={mergedShoppingCartData.reduce((total, item) => total + item.price, 0)} // 显示总金额但不传递
                onCheckout={handleCheckout}
                onShoppingCartClear={handleClearCart} // 调用handleClearCart方法
              />
            </div>
          </Affix>
        </Col>
      </Row>
    </MainLayout>
  );
};