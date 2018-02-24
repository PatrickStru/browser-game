/**
 * Created by Patrick Struger on 21.09.2016.
 */

//var once = true;
function startGame() {

    /*var InfiniteScroller = InfiniteScroller || {};

    InfiniteScroller.game = new Phaser.Game(800, 450, Phaser.CANVAS, '');

    InfiniteScroller.game.state.add('Boot', InfiniteScroller.Boot);
    InfiniteScroller.game.state.add('Preload', InfiniteScroller.Preload);
    InfiniteScroller.game.state.add('Game', InfiniteScroller.Game);

    InfiniteScroller.game.state.start('Boot');*/


    //if (once) {

        var game = new Phaser.Game(800, 450, Phaser.AUTO, "game-container", { preload: preload, create: create, update: update });

        // some sound effects

        //var sky;
        var player;
        var life = 3;

        var boss = null;
        var boss_life = 5;
        var boss_life_text;

        var baddie = null;
        var killed_enemies = 0;

        var timestamp = 0;
        var delay = 1.5;

        var rasengan_l = null;
        var rasengan_r = null;
        var rasengan_time = 1.5;

        // types of sound effects
        var theme = null;
        var enemy_hit = null;
        var player_hit = null;
        var theme_playing = false;

        var theme_name = null;


        //var ground;
        var platforms;

        var dragon;

        var enemy;

        // Text
        var life_text;
        var game_over = false;

        // Control buttons
        var b;
        var space;
        var cursors;

        var sun;
        var night;
        var background;

        var meters = 0;
        var meters_text;
        var meters_timestamp = 0;

        function preload() {

            // custom images
            //game.load.spritesheet('dragon', 'assets/dragon3.png', 198, 177);

            game.load.image('sun', 'assets/sun.png');
            game.load.image('rasengan', 'assets/rasengan.png');
            game.load.image('default-background', 'assets/default.png');

            game.load.spritesheet('baddie', 'assets/baddie.png', 32, 32);
            game.load.spritesheet('enemy', 'assets/gengaro_left2.png', 98, 100);

            game.load.image('sky', 'assets/sky.png');
            game.load.image('night', 'assets/night.png');
            game.load.image('star', 'assets/star.png');
            game.load.image('ground', 'assets/platform.png');
            game.load.spritesheet('dude', 'assets/dude.png', 32, 48);

            // some audio
            game.load.audio('forest', 'assets/audio/forest.ogg');
            game.load.audio('explosion', 'assets/audio/explosion.ogg');
            game.load.audio('battle_theme', 'assets/audio/retribution_short.ogg');
        }

        function create() {

            //  We're going to be using physics, so enable the Arcade Physics system
            game.physics.startSystem(Phaser.Physics.ARCADE);


            //game.add.sprite(0, 0, 'default-background');
            background = game.add.tileSprite(0, 0, 800, 450, 'default-background');

            sun = game.add.image(game.world.centerX, 60, 'sun');

            night = game.add.sprite(0, 0, 'night');
            night.alpha = 0;

            playTheme('forest');

            //game.world.setBounds(0, 0, 3500, game.height);


            /*//  A simple background for our game
            sky = game.add.tileSprite(0, game.height, game.world.width, 0, 'sky');
            //ground = game.add.tileSprite(0, game.height - 64, game.world.width, 0, 'ground');

            game.ground.scale.setTo(2, 2);
            game.ground.body.immovable = true;

            game.world.bringToTop(sky);
            game.world.bringToTop(ground);*/

            //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
            //game.ground.scale.setTo(2, 2);

            //  This stops it from falling away when you jump on it
            //game.ground.body.immovable = true;

            //  The platforms group contains the ground and the 2 ledges we can jump on
            platforms = game.add.group();

            //  We will enable physics for any object that is created in this group
            platforms.enableBody = true;

            // Here we create the ground.
            var ground = platforms.create(0, game.world.height - 64, 'ground');

            //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
            ground.scale.setTo(2, 2);

            //  This stops it from falling away when you jump on it
            ground.body.immovable = true;

            //  Now let's create two ledges
            var ledge = platforms.create(400, 225, 'ground');

            ledge.body.immovable = true;

            ledge = platforms.create(-150, 150, 'ground');

            ledge.body.immovable = true;


            // The player and its settings
            player = game.add.sprite(32, game.world.height - 150, 'dude');

            //dragon = game.add.sprite(80, game.world.height - 350, 'dragon');

            //enemy = game.add.sprite(game.world.width - 205, game.world.height - 200, 'enemy');

            //  We need to enable physics on the player
            game.physics.arcade.enable(player);

            //game.physics.arcade.enable(dragon);

            //game.physics.arcade.enable(enemy);

            //  Player physics properties. Give the little guy a slight bounce.
            // -------------------------------------------------------------
            player.body.bounce.y = 0.2;
            player.body.gravity.y = 300;
            player.body.collideWorldBounds = true;

            //  Our two animations, walking left and right.
            player.animations.add('left', [0, 1, 2, 3], 10, true);
            player.animations.add('right', [5, 6, 7, 8], 10, true);
            // -------------------------------------------------------------

            // baddie
            // -------------------------------------------------------------
            baddie = spawnBadAss();
            // -------------------------------------------------------------

            //enemy.animations.add('left', [0, 1], 10, true);

            //dragon.animations.add('fly', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,
            //18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40], 20, true);

            //game.camera.follow(player);

            // Controls
            // -------------------------------------------------------------
            cursors = game.input.keyboard.createCursorKeys();
            space = game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
            b = game.input.keyboard.addKey(Phaser.Keyboard.B);

            // Life display
            life_text = game.add.text(16, 16, 'LIFE: 3', {fontSize: '32px', fill: '#000'});

            // distance display
            meters_text = game.add.text(game.world.width - 250, 16, 'METERS: 0', {fontSize: '32px', fill: '#000'});


            //game.camera.follow(player);
        }

        function update() {




            if (!game_over) {

                // Move the boss
                // -------------------------------------------------------------
                if (boss != null && boss.body != null) {
                    // let the boss have random appearance every 2 seconds :D
                    if ((timestamp + 2) <= getTime()) {
                        boss.y = game.rnd.integerInRange(0, 350);
                        timestamp = getTime();
                    }
                    boss.animations.play('left');
                    boss.body.velocity.x = -100;
                }

                // Spawn and move the baddie
                // -------------------------------------------------------------
                if (baddie != null && baddie.getKilledEnemies() < 3) {

                    if (baddie.inXRange()) {
                        baddie.moveLeft();
                    } else {
                        baddie.destroy();
                        baddie = spawnBadAss();
                    }
                } else if (baddie.getKilledEnemies() < 3){
                    spawnBadAss();
                } else if (boss == null) {
                    spawnBoss();
                }

                // -------------------------------------------------------------

                baddie.checkCollisionWithWeapon(rasengan_r);
                baddie.checkCollisionWithWeapon(rasengan_l);
                /*if (rasengan_r != null && baddie != null) {
                    game.physics.arcade.overlap(rasengan_r, baddie.getInstance(), removeBaddie, null, this);
                }

                if (rasengan_l != null && baddie != null) {
                    game.physics.arcade.overlap(rasengan_l, baddie.getInstance(), removeBaddie, null, this);
                }*/

                if (rasengan_l != null && boss != null) {
                    game.physics.arcade.overlap(rasengan_l, boss, hitBoss, null, this);
                }

                if (rasengan_r != null && boss != null) {
                    game.physics.arcade.overlap(rasengan_r, boss, hitBoss, null, this);
                }

                if (player != null && baddie != null) {
                    game.physics.arcade.overlap(player, baddie, losingLife, null, this);
                }

                if (player != null && boss != null) {
                    game.physics.arcade.overlap(player, boss, losingLife, null, this);
                }

                // rasengan movement
                // -------------------------------------------------------------
                if (rasengan_l != null) {
                    if (rasengan_l.x <= 0) {
                        rasengan_l.kill();
                    }
                    else if ((timestamp + rasengan_time) <= getTime()) {
                        rasengan_l.kill();
                    }
                    else if (rasengan_l.body != null) {
                        rasengan_l.body.velocity.x = -175;
                        game.physics.arcade.collide(rasengan_l, platforms, removeRasengan, null, this);
                    }
                }

                if (rasengan_r != null) {
                    if (rasengan_r.x >= game.world.width) {
                        rasengan_r.kill();
                    }
                    else if ((timestamp + rasengan_time) <= getTime()) {
                        rasengan_r.kill();
                    }
                    else if (rasengan_r.body != null) {
                        rasengan_r.body.velocity.x = 175;
                        game.physics.arcade.collide(rasengan_r, platforms, removeRasengan, null, this);
                    }
                }
                // -------------------------------------------------------------

                //  Collide the player and the stars with the platforms
                game.physics.arcade.collide(player, platforms);

                //  Reset the players velocity (movement)
                player.body.velocity.x = 0;

                if (cursors.left.isDown) {
                    // move the background
                    background.tilePosition.x += 0.5;

                    //  Move to the left
                    player.body.velocity.x = -150;
                    player.animations.play('left');
                    if (space.isDown && timestamp + rasengan_time < getTime()) {
                        timestamp = getTime();
                        // let rasengan smash some enemies
                        rasengan_l = game.add.sprite(player.x - 85, player.y - 10, 'rasengan');
                        game.physics.arcade.enable(rasengan_l);
                        rasengan_l.enableBody = true;
                        rasengan_l.scale.setTo(0.05, 0.05);
                    }
                }
                // else if (cursors.right.isDown) {
                //     // move the background
                //     background.tilePosition.x -= 0.5;
                //
                //     //  Move to the right
                //     player.body.velocity.x = 150;
                //     player.animations.play('right');
                //     if (space.isDown && timestamp + rasengan_time < getTime()) {
                //         timestamp = getTime();
                //         // let rasengan smash some enemies
                //         rasengan_r = game.add.sprite(player.x + 55, player.y - 10, 'rasengan');
                //         game.physics.arcade.enable(rasengan_r);
                //         rasengan_r.enableBody = true;
                //         rasengan_r.scale.setTo(0.05, 0.05);
                //     }
                // }
                // else {
                //     //  Stand still
                //     player.animations.stop();
                //     player.frame = 4;
                // }

                // move the background
                background.tilePosition.x -= 2;

                if (player.body.touching.down) {
                    player.animations.play('right');
                } else {
                    player.frame = 6;
                }

                //  Allow the player to jump if they are touching the ground.
                if (cursors.up.isDown && player.body.touching.down) {
                    player.body.velocity.y = -300;
                }

                if ((meters_timestamp + 0.25) < getTime()) {
                    updateMeters();
                }

                game.world.wrap(player, (100 - game.world.width), false, true, false);
            }
            else {
                remove(player);
                remove(life_text);
                removeTheme(theme);
                game.add.text(game.world.centerX, game.world.centerY, 'GAME OVER', { fontSize: '32px', fill: '#000' });
            }
        }

        function updateMeters() {
            meters++;
            meters_text.text = "METERS: " + meters;
            meters_timestamp = getTime();
        }

        function spawnBadAss() {
            baddie = new Enemy(game);
            baddie.create(32, 96);
            baddie.setAnimation();
            baddie.setPhysics();
            //baddie.create(32, 96);
            /*baddie = game.add.sprite(game.world.width - 32, game.world.height - 96, 'baddie');
            baddie.animations.add('left', [0, 1], 8, true);
            baddie.animations.add('right', [2, 3], 8, true);
            game.physics.arcade.enable(baddie);*/
            return baddie;
        }

        function spawnBoss() {
            if (theme_name != 'battle_theme') {
                //removeTheme(theme);
                //playTheme('battle_theme');
            }
            game.add.tween(night).to({alpha: 1}, 2000, Phaser.Easing.Linear.None, true, 1, 1000, true);
            boss = game.add.sprite(game.world.width - 32, game.world.height - 180, 'enemy');
            boss.animations.add('left', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 2, true);
            boss.animations.add('right', [11, 12, 13, 14, 15, 16, 17, 18], 2, true);
            game.physics.arcade.enable(boss);
            boss.body.collideWorldBounds = true;
            timestamp = getTime();
            boss_life_text = game.add.text(game.world.centerX, 16, 'BOSS LIFE: 5', { fontSize: '32px', fill: '#000' });
            return boss;
        }

        function removeBaddie() {

            // play some awesome smash audio
            enemy_hit = game.add.audio('explosion');
            enemy_hit.play();

            baddie.
            baddie = null;
            delete baddie;

            if (rasengan_r != null) {
                rasengan_r.kill();
            }
            if (rasengan_l != null) {
                rasengan_l.kill();
            }
            //baddie = null;
            killed_enemies++;
        }

        function hitBoss() {
            // play some awesome smash audio
            enemy_hit = game.add.audio('explosion');
            enemy_hit.play();

            if (rasengan_r != null) {
                rasengan_r.kill();
            }
            if (rasengan_l != null) {
                rasengan_l.kill();
            }

            boss_life--;
            boss_life_text.text = 'BOSS LIFE: ' + boss_life;
            if (boss_life == 0) {
                remove(boss);
                boss = null;
            }
        }

        function removeRasengan(rasengan, platform) {
            rasengan.kill();
        }

        function losingLife(player, baddie) {
            life--;
            life_text.text = 'LIFE: ' + life;
            if (life == 0) {
                // GAME OVER
                game_over = true;
            }
            else if (player != null) {
                player.y = player.y - 100;
            }
        }

        function playTheme(name) {
            if (!theme_playing) {
                theme_name = name;
                theme = game.add.audio(name);
                theme.play();
                theme_playing = true;
            }
        }

        function removeTheme(theme) {
            if (theme != null && theme_playing == true){
                theme.destroy();
                game.cache.removeSound(theme_name);
                theme_playing = false;
            }
        }

        function remove(sprite) {
            if (sprite != null) {
                sprite.destroy();
            }
        }

        function getTime() {
            return game.time.totalElapsedSeconds();
        }
        //once = false;
    //}
}