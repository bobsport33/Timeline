import React, { useRef, useEffect } from "react";
import styled from "styled-components";

const MenuContainer = styled.div`
    position: absolute;

    background: white;
    border: 1px solid gray;
    padding: 10px;
    box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);
    z-index: 1000;
`;

const Menu = ({
    menu,
    setMenu,
    handleColorInputChange,
    handleTitleInputChange,
}) => {
    const menuRef = useRef();

    useEffect(() => {
        console.log("vis", menu.visible);
        const handleClickOutside = (event) => {
            console.log("click outside event", event);
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenu({ visible: false, x: 0, y: 0, selectedBar: null });
            }
        };

        if (menu.visible) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
    return (
        <MenuContainer
            ref={menuRef}
            style={{
                top: menu.y,
                left: menu.x,
            }}
        >
            <input
                onChange={(e) => handleTitleInputChange(e, menu.selectedBar)}
                value={menu.selectedBar.name}
            />

            <input
                type="color"
                value={menu.selectedBar.color}
                onChange={(e) => handleColorInputChange(e, menu.selectedBar)}
                style={{ marginLeft: "8px" }}
            />
        </MenuContainer>
    );
};

export default Menu;
