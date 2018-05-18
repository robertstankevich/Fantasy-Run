import Phaser from "phaser";
import sheet1 from "../assets/deer.png";
import sheet2 from "../assets/wolf3.png";
import sheet3 from "../assets/deerondrugs.png";
import snow from "../assets/snow.png";
import star from "../assets/star.png";
import pill from "../assets/magicpill.png";

var keypress1;
var keypress2;
var keypress3;
var keypress4;
var victory = false;
var deer1dead = false;
var deer2dead = false;

export default class RaceScene extends Phaser.Scene {

    constructor() {
        super({ key: 'RaceScene' });
    }

    preload() {
        this.load.image('snow', snow);
        this.load.image('star', star);
        this.load.spritesheet('runningdeer', sheet1, { frameWidth: 32, frameHeight: 32, endFrame: 15 });
        this.load.spritesheet('crazydeer', sheet3, { frameWidth: 32, frameHeight: 32, endFrame: 15 });
        this.load.spritesheet('pill', pill, { frameWidth: 32, frameHeight: 32, endFrame: 23 });
        this.load.spritesheet('runningwolf', sheet2, { frameWidth: 64, frameHeight: 32});
    }

    create() {

        this.add.image(400, 300, 'snow').setScale(7, 5);
        this.line = new Phaser.Geom.Line(750, 700, 750, 0);
        this.add.graphics({ lineStyle: { width: 4, color: 0xaa00aa } }).strokeLineShape(this.line);
        var adconfig = {
            key: 'deerrun',
            frames: this.anims.generateFrameNumbers('runningdeer', { start: 10, end: 14, first: 14 }),
            frameRate: 7,
            repeat: -1
        };

        var cdconfig = {
            key: 'crazyrun',
            frames: this.anims.generateFrameNumbers('crazydeer', { start: 10, end: 14, first: 14 }),
            frameRate: 22,
            repeat: -1
        };

        var awconfig = {
            key: 'wolfrun',
            frames: this.anims.generateFrameNumbers('runningwolf', { start: 0, end: 4, first: 0 }),
            frameRate: 8,
            repeat: -1
        };

        var pconfig = {
            key: 'pillshine',
            frames: this.anims.generateFrameNumbers('pill', { start: 0, end: 23, first: 0 }),
            frameRate: 22,
            repeat: -1
        };

        this.anims.create(cdconfig);
        this.anims.create(adconfig);
        this.anims.create(awconfig);
        this.anims.create(pconfig);

        if(Math.random() > 0.5){
            this.starSprite = this.add.sprite(300, 200, 'star');
        }
        else{
            this.starSprite = this.add.sprite(300, 400, 'star');
        }

        this.starSprite.play('pillshine');

        this.deerSprite1 = this.physics.add.sprite(40, 200, 'runningdeer')
            .setScale(1.5, 1.5)
            .play('deerrun')
            ;

        this.deerSprite2 = this.physics.add.sprite(40, 400, 'runningdeer')
            .setScale(1.5, 1.5)
            .play('deerrun')
            ;

        this.wolfSprite1 = this.physics.add.sprite(-60, 200, "runningwolf")
            .setScale(1.5, 1.5)
            .play('wolfrun')
            ;

        this.wolfSprite2 = this.physics.add.sprite(-60, 400, "runningwolf")
            .setScale(1.5, 1.5)
            .play('wolfrun')
            ;

        keypress1 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        keypress2 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

        keypress3 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);

        keypress4 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);

    }

    update() {
        if(!victory){
            this.wolfSprite1.x+= 0.3;
            this.wolfSprite2.x+= 0.3;
        }
        this.checkActions();
        this.checkState(this.deerSprite1, this.wolfSprite1);
        this.checkState(this.deerSprite2, this.wolfSprite2);
    }

    checkActions(){
        if(!victory){
            if(!deer1dead){
                if (Phaser.Input.Keyboard.JustDown(keypress1)) {
                    this.deerSprite1.x += 10;
                }
                if (Phaser.Input.Keyboard.JustDown(keypress4)) {
                    this.deerSprite1.x -= 10;
                }
            }
            if(!deer2dead){
                if (Phaser.Input.Keyboard.JustDown(keypress2)) {
                    this.deerSprite2.x += 10;
                }
                if (Phaser.Input.Keyboard.JustDown(keypress3)) {
                    this.deerSprite2.x -= 10;
                }
            }
        }
    }

    checkState(deer, wolf){
        var deernum = 0;
        var deerdead;
        if(deer.y == 200){
            deernum = 2;
            deerdead = deer2dead;
        }
        else if (deer.y == 400){
            deernum = 1;
            deerdead = deer1dead;
        }
        if(!victory && !deerdead){
            if(deer.x <= wolf.x){
                this.add.text(deer.x, deer.y, 'Wolf got you!!!', { fontFamily: 'Arial', fontSize: 52, color: 'red' });
                deer.destroy();
                
                /*if(deernum == 1){
                    deer1dead = true;
                }
                else if(deernum == 2){
                    deer2dead = true;
                }*/
            }
            else if(deer.x >= 750){
                wolf.destroy();
                if(deernum == 1){
                    this.add.text(200, deer.y, 'Deer One won!', { fontFamily: 'Arial', fontSize: 52, color: 'green' });
                }
                else if(deernum == 2){
                    this.add.text(200, deer.y, 'Deer Two won!', { fontFamily: 'Arial', fontSize: 52, color: 'green' });
                }
                victory = true;
            }

            if(deer.x == this.starSprite.x && deer.y == this.starSprite.y){
                deer.setGravityX(20);
                this.starSprite.destroy();
                deer.play('crazyrun');
            }
        }
    }

}