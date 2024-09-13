import React from "react";
import { Link } from "react-router-dom";
import { List, Rate, Space, Image, Tag, Typography, Button, Row, Col } from "antd";
import { MessageOutlined, LikeOutlined, StarOutlined, DeleteOutlined } from "@ant-design/icons";

import hotel1 from "../../assets/images/hotel_1.jpg";

const { Text } = Typography;

export interface Product {
  itemKey: string;
  RoomTypeName: string; // 房间类型名称
  roomTypeId: string; // 房间类型ID
  HotelName: string; // 酒店名称
  cityName: string; // 城市名称
  price: number; // 价格
  checkInDate: string; // 入住日期
  checkOutDate: string; // 退房日期
  nights: number; // 夜晚数
  HotelRating: number | string; // 酒店星级
  Description?: string; // 描述
  HotelFacilities?: string; // 酒店设施
  Attractions?: string; // 景点
}

interface PropsType {
  data: Product[] | null;
  paging?: {
    currentPage: number;
    pageSize: number;
    totalCount: number;
  };
  onPageChange?: (nextPage: number, pageSize: number) => void;
  onDelete?: (itemKey: string) => void; 
}

const convertRating = (rating: string | number): number => {
  if (typeof rating === 'number') return rating; 
  switch (rating) {
    case "OneStar":
      return 1;
    case "TwoStar":
      return 2;
    case "ThreeStar":
      return 3;
    case "FourStar":
      return 4;
    case "FiveStar":
      return 5;
    default:
      return 0; 
  }
};

const listData = (productList: Product[]) =>
  productList.map((p) => ({
    key: p.itemKey,
    id: p.roomTypeId,
    title: `${p.RoomTypeName}`, // 显示房间类型名称，酒店名称和城市名称
    description: `Check-in: ${p.checkInDate}, Check-out: ${p.checkOutDate}, Nights: ${p.nights}`, // 显示预定时间段和时长
    tags: (
      <>
        {p.HotelName && <Tag color="#2db7f5">{p.HotelName}</Tag>}
        {p.cityName && <Tag color="#f50">{p.cityName}</Tag>}
      </>
    ),
    imgSrc: hotel1,
    price: p.price,
    rating: p.HotelRating,
  }));

const IconText = ({ icon, text }: { icon: any; text: string | number }) => (
  <Space>
    {React.createElement(icon)}
    {text}
  </Space>
);

export const ProductList: React.FC<PropsType> = ({ data, paging, onPageChange, onDelete }) => {
  if (!data) {
    return <div>No products available</div>;
  }

  const products = listData(data);

  return (
    <List
      itemLayout="vertical"
      size="large"
      pagination={
        paging
          ? {
              current: paging.currentPage,
              onChange: (page) => onPageChange && onPageChange(page, paging.pageSize),
              pageSize: paging.pageSize,
              total: paging.totalCount,
            }
          : false
      }
      dataSource={products}
      footer={
        paging && (
          <div>
            Total: <Text strong>{paging.totalCount}</Text> items
          </div>
        )
      }
      renderItem={(item) => (
        <List.Item
          key={item.key} 
          actions={[
            <IconText icon={StarOutlined} text="156" key="list-vertical-star-o" />,
            <IconText icon={LikeOutlined} text="156" key="list-vertical-like-o" />,
            <>
              <Rate allowHalf disabled defaultValue={convertRating(item.rating ?? 0)} />
              <Text strong className="ant-rate-text">{convertRating(item.rating ?? 0)} Stars</Text>
            </>,
          ]}
          extra={<Image width={272} height={172} alt="image" src={item.imgSrc || ''} />}
        >
          <List.Item.Meta
            title={
              <Row justify="space-between" align="middle">
                <Col>
                  <Text style={{ fontSize: 20, fontWeight: 400 }}>$ {item.price}</Text>
                  <Link to={`/detail/${item.id}`}> {item.title}</Link>
                </Col>
                <Col>
                  <Button
                    icon={<DeleteOutlined />}
                    type="link"
                    onClick={() => onDelete && onDelete(item.key)} // 删除按钮，调用 onDelete prop
                    style={{ float: "right" }}
                  >
                    Remove
                  </Button>
                </Col>
              </Row>
            }
            description={item.tags}
          />
          {item.description}
        </List.Item>
      )}
    />
  );
};