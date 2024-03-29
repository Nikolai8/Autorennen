﻿import { getCanvas, distance, imgCar, winGame } from './canvas_lib.js';
import { TouchInteraction } from './touch.js'
import { interactive_circle } from './interaction.js'

window.onload = () => {
    let context_object = getCanvas("canvas01");
    let context = context_object.context;
    let runden1 = -1;
    let runden2  = -1;
    let maxRunden = 2;
    let color1 = "#b53737";
    let color2 = "#0047ab";
    let car1Goal = false;
    let car2Goal = false;
    let endGame = false;
    let startGame = true;
    let animateFrame;
    let grabbable = [];

    let car1Img = new Image();
    let car1X = context_object.canvas.width/2 - context_object.canvas.width/3 + context_object.canvas.width/3 - 50*context_object.scale;
    let car1Y = context_object.canvas.height/2 - context_object.canvas.height/3 + 30*context_object.scale;
    let car2X = context_object.canvas.width/2 - context_object.canvas.width/3 + context_object.canvas.width/3 - 50*context_object.scale;
    let car2Y = context_object.canvas.height/2 - context_object.canvas.height/3 + 75*context_object.scale;
    car1Img.src = './images/car1.png';
    let car2Img = new Image();
    car2Img.src = './images/car2.png';
    
    
    let car1 = imgCar(context_object, car1Img, car1X, car1Y);
    let car2 = imgCar(context_object, car2Img, car2X, car2Y);

    let button1 = interactive_circle(context_object, context_object.canvas.width - 80 * context_object.scale, context_object.canvas.height - 80 * context_object.scale, 120, color1);
    window.addEventListener('resize', () => button1.move(context_object.canvas.width - 80, context_object.canvas.height - 80));
    let button2 = interactive_circle(context_object, 0 + 80 * context_object.scale, 0 + 80 * context_object.scale, 120, color2);
    grabbable.push(button1, button2);

    let drawFingers = TouchInteraction(context_object, grabbable);


    car1.interaction = function (ic) {
        let d = distance(ic.mx, ic.my, ic.tx, ic.ty);

        if (d > 10) {
            let dx = ic.x - ic.mx;
            let dy = ic.y - ic.my;
            this.rotateRadians(Math.atan2(dy, dx) + Math.PI / 2);
            if (d > 20) {
                dx = ic.mx - ic.tx;
                dy = ic.my - ic.ty;
                if (!ic.stopMove) this.delta_move(dx / 20, dy / 20);
            }
        }
    }

    car2.interaction = function (ic) {
        let d = distance(ic.mx, ic.my, ic.tx, ic.ty);

        if (d > 10) {
            let dx = ic.x - ic.mx;
            let dy = ic.y - ic.my;
            this.rotateRadians(Math.atan2(dy, dx) + Math.PI / 2);
            if (d > 20) {
                dx = ic.mx - ic.tx;
                dy = ic.my - ic.ty;
                if (!ic.stopMove) this.delta_move(dx / 20, dy / 20);
            }
        }
    }

    let identity = new DOMMatrix();

    function draw() {
        context_object.pre_draw(runden1, runden2, color1, color2);

        button1.setScale(context_object.scale);
        button2.setScale(context_object.scale);
        car1.setScale(context_object.scale);
        car2.setScale(context_object.scale);

        car1.interaction(button1.get());
        car2.interaction(button2.get());

        button1.draw(identity);
        button2.draw(identity);
        //car1.draw(identity);
        //car2.draw(identity);
        car1.draw();
        car2.draw();

        if (startGame == true) {
            context.fillStyle = "#eee";
            context.roundRect(context_object.canvas.width/2 - 200*context_object.scale, context_object.canvas.height/2 - 100*context_object.scale, 400*context_object.scale, 200*context_object.scale, 20);
            context.fill();
            context.translate(context_object.canvas.width/2 - 200*context_object.scale, context_object.canvas.height/2 - 100*context_object.scale);

            context.fillStyle = "#000";
            context.font = `${context_object.fontSize}px Verdana`;
            context.fillText(`Wer schafft als`, context_object.fontSize * 0.6, context_object.fontSize * 2);
            context.fillText(`erster ${maxRunden} Runden?`, context_object.fontSize * 0.6, context_object.fontSize * 3.5);

            context.resetTransform();
            
            if (context.isPointInPath(context_object.goal, car1.x, car1.y) || context.isPointInPath(context_object.goal, car2.x, car2.y)) {
                startGame = false;
            }
        }

        if (context.isPointInPath(context_object.goal, car1.x, car1.y)) {
            car1Goal = true;
        };
        if (context.isPointInPath(context_object.goal, car2.x, car2.y)) {
            car2Goal = true;
        };

        if (car1Goal == true) {
            if (!context.isPointInPath(context_object.goal, car1.x, car1.y)) {
                runden1++;
                if(runden1 == maxRunden) {
                    context_object.pre_draw(runden1, runden2, color1, color2);
                    winGame(context, 1, color1, context_object.fontSize, context_object.scale);
                    resetGame();
                }
                car1Goal = false;
            }
        }
        if (car2Goal == true) {
            if (!context.isPointInPath(context_object.goal, car2.x, car2.y)) {
                runden2++;
                if(runden2 == maxRunden) {
                    context_object.pre_draw(runden1, runden2, color1, color2);
                    winGame(context, 2, color2, context_object.fontSize, context_object.scale);
                    resetGame();
                }
                car2Goal = false;
            }
        }

        function resetGame() {
            car1.reset(car1X, car1Y);
            car2.reset(car2X, car2Y);
            runden1 = 0;
            runden2 = 0;
            endGame = true
        }

        drawFingers(identity);

        animateFrame = window.requestAnimationFrame(draw);
        if (endGame) {
            window.cancelAnimationFrame(animateFrame);
            setTimeout(() => { window.requestAnimationFrame(draw) }, 5000);
            endGame = false;
            startGame = true;
        }
    }
    draw();
}