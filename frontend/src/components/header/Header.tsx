import React, { useState, useEffect } from "react";
import image from "../../assets/image.png";
import styles from "./Header.module.css";
import { Typography, Button, Row, Col, Spin } from "antd";
import { DollarCircleOutlined, GlobalOutlined, QuestionCircleOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { currencyItems } from "../../assets/data/CurrencyItems";
import { useSelector, useAppDispatch } from "../../redux/hooks";
import { useTranslation } from "react-i18next";
import jwt_decode, { JwtPayload as DefaultJwtPayload } from "jwt-decode";
import { changeLanguage } from "../../redux/language/slice";
import { authSlice } from "../../redux/auth/slice";
import { getShoppingCart } from "../../redux/shoppingCart/slice";

export const Header: React.FC = () => {
  const [visibleDropdown, setVisibleDropdown] = useState<string | null>(null);
  const [selectedCurrency, setSelectedCurrency] = useState<string>("NZD");
  const navigate = useNavigate();

  const language = useSelector((state) => state.language.language);
  const languageList = useSelector((state) => state.language.languageList);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const jwt = useSelector((s) => s.user.token);
  const email = useSelector((s) => s.user.email);
  const [username, setUsername] = useState("");
 

  const shoppingCartItems = useSelector((state) => state.shoppingCart.items);
  const shoppingCartLoading = useSelector((state) => state.shoppingCart.loading);


  const handleIconClick = (type: string, e?: any) => {
    if (type === "language" && e) {
      dispatch(changeLanguage(e.key)); // 仅处理已有语言的切换
    }
    setVisibleDropdown(visibleDropdown === type ? null : type); // 切换下拉菜单的可见性
  };

  const renderDropdown = (type: string, items: any[]) => {
    return (
      visibleDropdown === type && (
        <div className={styles["menu-list"]}>
          {items.map((item, index) => (
            <a
              href="javascript:void(0)"
              className={styles["dropdown-item"]}
              key={index}
              onClick={() => handleIconClick(type, { key: item.code })}
            >
              {item.flag && (
                <span role="img" aria-label={item.name}>
                  {item.flag}
                </span>
              )}
              {" " + item.name}
            </a>
          ))}
        </div>
      )
    );
  };

  const currentLanguageName = languageList.find(
    (l: { code: string; name: string }) => l.code === language
  )?.name;

  const onLogout = () => {
    dispatch(authSlice.actions.logOut());
    navigate("/");
  };

  return (
    <div className={styles["app-header"]}>
      <Row className={styles["top-header"]}>
        <Col className={styles["logo-header"]}>
          <span onClick={() => navigate("/")}>
            <Typography.Title level={3} className={styles.title}>
              Te Tira
            </Typography.Title>
          </span>
          <Typography.Text className={styles.slogan}>
            Ka tīmata tō haerenga Kiwi i konei
          </Typography.Text>
        </Col>
        <Col className={styles["header-image"]}>
          <img src={image} alt=" " className={styles.image} />
        </Col>
        <Col className={styles["top-button"]}>
          <Col onClick={() => handleIconClick("currency")}>
            <DollarCircleOutlined className={styles["button-icon"]} />
            <Typography.Text className={styles["selected-item"]}>{selectedCurrency}</Typography.Text>
            {renderDropdown("currency", currencyItems)}
          </Col>
          <Col onClick={() => handleIconClick("language")}>
            <GlobalOutlined className={styles["button-icon"]} />
            <Typography.Text className={styles["selected-item"]}>
              {currentLanguageName || "Language"}
            </Typography.Text>
            {renderDropdown("language", languageList)}
          </Col>
          <Col onClick={() => window.location.href = "/help"}>
            <QuestionCircleOutlined className={styles["button-icon"]} />
            <Typography.Text className={styles["selected-item"]}>{t("header.help")}</Typography.Text>
          </Col>
        </Col>
        {jwt ? (
          <Col className={styles["auth-container"]}>
            <Col className={styles["cart-button"]} onClick={() => navigate("/shoppingCart")}>
              <Spin spinning={shoppingCartLoading}>
                <ShoppingCartOutlined className={styles["button-icon"]} />
                <Typography.Text className={styles["selected-item"]}>
                {shoppingCartItems?.length || 0}
                </Typography.Text>
              </Spin>
            </Col>
            <Col>
              <Typography.Text className={styles["logged-in-user"]}>{email}</Typography.Text>
            </Col>
            <Col>
              <Button className={styles["auth-btn"]} onClick={onLogout}>{t("header.logout")}</Button>
            </Col>
          </Col>
        ) : (
          <Col className={styles["auth-container"]}>
            <Button.Group className={styles["user-auth"]}>
              <Button className={styles["auth-btn"]} onClick={() => navigate("/register")}>
                {t("header.register")}
              </Button>
              <Button className={styles["auth-btn"]} onClick={() => navigate("/login")}>
                {t("header.login")}
              </Button>
            </Button.Group>
          </Col>
        )}
      </Row>
    </div>
  );
};