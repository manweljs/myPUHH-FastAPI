"use client";
import Image from "next/image";
import styles from "./page.module.css";
import { Button } from "antd";
import { useState } from "react";

export default function Home() {

  const [loading, setLoading] = useState(false);

  const scrape = async () => {
    setLoading(true);
    const response = await fetch('/scrap');
    console.log('response', response)
    const result = await response.json();
    console.log('result', result)
    setLoading(false);
  }
  return (
    <main className={styles.main}>
      <Button
        type="primary"
        loading={loading}
        onClick={() => scrape()}>Primary Button</Button>
    </main>
  );
}
