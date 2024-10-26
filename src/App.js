import image from './ava.jpg'
import './App.css';
import React, { useEffect, useRef, useState } from "react";

export default function App() {
  return (
    <div className='content'>
      <header><Avatar /></header>
      <h1>Hi, I'm Nikita!</h1>
      <p>Play game!</p>
      <canvas id="canvas"></canvas>
      <MiniGame />
    </div>
  );
}

// function AgainButton(){
//   return(

//   );
// }

function Avatar(){
  return (
    <img
      className='avatar'
      src={image}
      alt='yours avatar'
      width={150}
      height={150}
    />
  );
}

function MiniGame(){
  const [count, setCount] = useState(0);
  const canvasRef = useRef(null);
  const [x, setX] = useState(75);
  const [y, setY] = useState(75);
  const [dx, setDx] = useState(2);
  const [dy, setDy] = useState(4);
  const [paddlex, setPaddlex] = useState(0);
  const paddleh = 10;
  const paddlew = 75;
  const [rightArrow, setRightArrow] = useState(false);
  const [leftArrow, setLeftArrow] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const WIDTH = 400;
  const HEIGHT = 400;

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    const intervalId = setInterval(() => {
      if (!gameOver) {
        draw(context);
      }
    }, 10);

    return () => clearInterval(intervalId);
  }, [x, y, paddlex, rightArrow, leftArrow, gameOver]);

  useEffect(() => {
    const handleKeyDown = (evt) => {
      if (evt.keyCode === 39) setRightArrow(true);
      else if (evt.keyCode === 37) setLeftArrow(true);
    };

    const handleKeyUp = (evt) => {
      if (evt.keyCode === 39) setRightArrow(false);
      else if (evt.keyCode === 37) setLeftArrow(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  const clear = (context) => {
    context.clearRect(0, 0, WIDTH, HEIGHT);
  };

  const circle = (context, x, y, r) => {
    context.beginPath();
    context.arc(x, y, r, 0, Math.PI * 2, true);
    context.closePath();
    context.fill();
  };

  const rect = (context, x, y, w, h) => {
    context.beginPath();
    context.rect(x, y, w, h);
    context.closePath();
    context.fill();
  };
  
  const score = (context) => {
    context.fillStyle = "black";
    context.font = '14px Fantasy';
    context.fillText(count, 8, 20)
  };

  const draw = (context) => {
    clear(context);

    // Рисуем мяч
    circle(context, x, y, 10);

    // Двигаем платформу
    if (rightArrow) setPaddlex((prev) => Math.min(prev + 5, WIDTH - paddlew));
    if (leftArrow) setPaddlex((prev) => Math.max(prev - 5, 0));

    // Рисуем платформу
    rect(context, paddlex, HEIGHT - paddleh, paddlew, paddleh);

    // Проверка столкновения с границами
    if (x + dx > WIDTH || x + dx < 0) setDx(-dx);
    if (y + dy < 0){ 
      setDy(-dy);
    }else if (y + dy > HEIGHT) {
      // Проверка на попадание мяча на платформу
      if (x > paddlex && x < paddlex + paddlew) {
        setDy(-dy);
        setCount(count+1);
        if(count>=10){
          context.fillStyle = "Black";
          context.font = "32px fantasy";
          context.fillText("You've won 10 TON!!!!", 100, 160);
          setGameOver(true);
          setCount(0);
        }
      } else {
        // Конец игры
        context.fillStyle = "Black";
        context.font = "40px fantasy";
        context.fillText("Game Over", 100, 160);
        setGameOver(true);
        setCount(0);
        return;
      }
    }

    // Обновляем координаты мяча
    setX((prev) => prev + dx);
    setY((prev) => prev + dy);
    score(context)
  };

  return (
    <div>
      <canvas ref={canvasRef} width={WIDTH} height={HEIGHT} />
      {gameOver}
    </div>
  );
}