/*
 * @Author: Dongge
 * @Date: 2021-10-21 13:42:02
 * @LastEditTime: 2022-04-20 13:38:08
 * @Description: file content
 */
import { useEffect, useRef, useState } from "react";

// 改变网页的title
export const useDocumentTitle = (title: string, keepOnUnmount = true) => {
  // const oldTitle = document.title;
  // 页面加载时旧title
  // 加载后： 新title
  const oldTitle = useRef(document.title).current;
  useEffect(() => {
    document.title = title;
  }, [title]);

  useEffect(() => {
    return () => {
      if (!keepOnUnmount) {
        // 如果不指定依赖，读到的就是旧的titlte
        document.title = oldTitle;
      }
    };
  }, [keepOnUnmount, oldTitle]);
};

const isVoid = (value: unknown) => value === undefined || value === null;

export const cleanDataVoid = <T extends { [key in string]: unknown }>(object: T) => {
  const result = { ...object };
  Object.keys(result).forEach((item) => {
    const value = result[item];
    if (isVoid(value)) {
      delete result[item];
    }
  });
  return result;
};

// 获取图片的方法
export const getImgUrl = (fileName: string) => {
  const { href } = new URL(`../assets/img/${fileName}.png`, import.meta.url);
  return href;
};

// 获取图片的方法
export const getSVgImgUrl = (fileName: string) => {
  const { href } = new URL(`../assets/img/${fileName}.svg`, import.meta.url);
  return href;
};

// effect只加载一次
export const useMounted = (callback: () => void) => {
  useEffect(() => {
    callback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
