import React, { useEffect, useState } from "react";
import styles from "./Booking.module.css";
import { PaymentForm, CheckOutCard, ProductList } from "../../components";
import { MainLayout } from "../../layouts/mainLayout";
import { Row, Col, Affix } from "antd";
import { useSelector, useAppDispatch } from "../../redux/hooks";
import { booking } from "../../redux/booking/slice";
import { useLocation } from "react-router-dom";

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

export const BookingPage: React.FC = () => {
  const jwt = useSelector((s) => s.user.token) as string;
  const loading = useSelector((s) => s.booking.loading);
  const order = useSelector((s) => s.booking.currentOrder);
  const dispatch = useAppDispatch();
  const location = useLocation();

  // 获取从ShoppingCart页面传递过来的购物车信息
  const [products, setProducts] = useState<Product[]>(() => {
    const initialProducts = location.state?.products || [];
    return initialProducts.map((product) => ({
      ...product,
      itemKey: product.itemKey || `${product.roomTypeId}-${product.checkInDate}`, // 生成 itemKey
    }));
  });

  // 计算总金额
  const totalPrice = products.reduce((total, item) => total + item.price, 0);

  // 定义处理表单提交的函数
  const handleCheckout = (orderDetails: any) => {
    if (orderDetails && order) {
      const orderItem = {
        userId: order.userId, // 从当前订单中提取
        hotelId: order.hotelId, // 从当前订单中提取
        roomTypeId: order.roomTypeId, // 从当前订单中提取
        checkInDate: order.checkInDate, // 从当前订单中提取
        checkOutDate: order.checkOutDate, // 从当前订单中提取
        totalPrice: order.totalPrice, // 从当前订单中提取
      };

      dispatch(booking({ jwt, orderItem }));
    }
  };

  return (
    <MainLayout>
      <Row>
        <Col span={16}>
          <div className={styles["product-list-container"]}>
            <PaymentForm />
            {/* 在支付表单下方显示产品列表 */}
          </div>
          <div className={styles["product-list-container"]}>
            <ProductList data={products} onDelete={() => {}} />
          </div>
        </Col>
        <Col span={8}>
          <Affix>
            <div className={styles["checkout-card-container"]}>
              {order ? (
                <CheckOutCard
                  loading={loading}
                  order={order}
                  onCheckout={(orderDetails) => handleCheckout(orderDetails)}
                  totalPrice={totalPrice} // 将 totalPrice 传递给 CheckOutCard
                />
              ) : (
                <div>No order available.</div>
              )}
            </div>
          </Affix>
        </Col>
      </Row>
    </MainLayout>
  );
};