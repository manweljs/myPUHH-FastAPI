import { Pagination } from "antd";
import React, { useState } from "react";
import style from "./global.module.sass";

export const CustomPagination = (props: {
    count: number;
    onChange: (page: number) => void;
}) => {
    const { count, onChange } = props;
    const totalItemsPerPage = 100; // Your page size
    const [currentPage, setCurrentPage] = useState(1);

    const handlePageChange = (page: number) => {
        // console.log(page)
        setCurrentPage(page);
        onChange(page);
    };

    return (
        <Pagination
            current={currentPage}
            total={count}
            pageSize={totalItemsPerPage}
            onChange={handlePageChange}
            showSizeChanger={false}
            showQuickJumper={false}
            className={style.custom_pagination}
        />
    );
};