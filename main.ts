namespace JupiterCore {
    export const ID = "JupiterCore";

    export const MainPlane = Builders.createPlane();
    export const Core = Builders.createProject(MainPlane);

    export const LOGGER = new Logger(ID);

    export const ENTRIES = new MenuEntryRegistry(MainPlane);
    export const DATAPACKAGES = new DataPackRegistry(MainPlane);
    export const SPRITES = new SpriteRegistry(MainPlane);
    export const OBJECTS = new ObjectRegistry(MainPlane);

    export const PACK = DATAPACKAGES.create();

    Core.build(function onInit() {
        buildRegistries();
        PACK.exportAll();
    });

    export function buildRegistries() {
        JupiterCore.ENTRIES.build();
        JupiterCore.DATAPACKAGES.build();
        JupiterCore.OBJECTS.build();
        JupiterCore.SPRITES.build();
    }
}

namespace Jupiter {
    export const Main = Builders.createProject(JupiterCore.MainPlane);
    export const ID = "Jupiter";
    export const LOGGER = new Logger(ID);

    export const BEGIN_GAME = JupiterCore.ENTRIES.create("begin game", img`
        .....75....757....57..7.....77..
        ..5.55555.577775..755.7..7757...
        ..5.577.565747.766777766775e777.
        ....775.77577667677676776767777.
        55.757.75676777777777767c77667..
        7e5454777777765567776766677677.7
        ..77757777777566667676566777677.
        .5.7657577775777777667677766766.
        .7777674576767777676677677776767
        ..77..77777577777777577757767c67
        ..775755777755777777577777776777
        .55557755.7567777777677777566.66
        .557777ee7677767767767767667677.
        .577.77777777767767e67776767....
        .5577777.775777776776776676777.6
        5..777777.77777777776767767766..
        5.557...77777777776767767667.66.
        ..555.7777.77.756767cc667677676.
        ...7...77777.777676657767776776.
        .....77....7.5577e7665.7...666..
        .....57....77..666767..7.6......
        .....7..........4eeee.6.........
        ................46ee6...........
        ................4eeec...........
        ................4eeec...........
        ...............e4eece...........
        ...............eeeece...........
        ..............44eeecce..........
        ............444eeeeccc..........
        .........eee44ee.ececccec.......
        .......eeee.4ee..ece.cccec......
        ....eee....e......e...eee.ccee..
    `, function click() {
        scene.systemMenu.closeMenu();
        run();
    });

    export function run() {
        const mainPlayer = JupiterCore.SPRITES.create(img`
        1 1 1 1
        1 1 1 1
        1 1 1 1
        1 1 1 1
    `, SpriteKind.Player);
        const playerObj = JupiterCore.OBJECTS.create(mainPlayer);

        playerObj.build(function playerObjScript(sprite: Sprite) {
            const baseSpeed = 100;
            let speed = baseSpeed;
            let shouldShowTrail = true;

            forever(function controls() {
                controller.moveSprite(sprite, speed, speed);
            });

            forever(function dash() {
                speed = controller.A.isPressed() ? 200 : baseSpeed;
            });

            forever(function trailRenderer() {
                if (shouldShowTrail) {
                    if (mainPlayer.vx != 0 || mainPlayer.vy != 0) {
                        const trailParticle = JupiterCore.SPRITES.create(img`
                    1 1 1 1
                    1 1 1 1
                    1 1 1 1
                    1 1 1 1
                `, SpriteKind.Projectile);
                        const tpObj = JupiterCore.OBJECTS.create(trailParticle);

                        tpObj.build(function trailParticleScript(sprite: Sprite) {
                            sprite.setPosition(mainPlayer.x, mainPlayer.y);

                            animation.runImageAnimation(sprite, [
                                img`
                            1 1 1 1
                            1 1 1 1
                            1 1 1 1
                            1 1 1 1
                        `,
                                img`
                            . . . .
                            . 1 1 .
                            . 1 1 .
                            . . . .
                        `,
                                img`
                            . . . .
                            . . . .
                            . . . .
                            . . . .
                        `
                            ], 100, false);

                            sprite.lifespan = 200;
                        });

                        pause(10);
                    }
                }

                info.setScore(sprites.allOfKind(SpriteKind.Projectile).length);
            });
        });

        const ball = JupiterCore.SPRITES.create(img`
        2 2 2 2
        2 2 2 2
        2 2 2 2
        2 2 2 2
    `, SpriteKind.Enemy);
        const ballObj = JupiterCore.OBJECTS.create(ball);

        ballObj.build(function ballObjScript(sprite: Sprite) {
            let speed = 90;

            sprite.setVelocity(-speed, -speed);
            sprite.setFlag(SpriteFlag.BounceOnWall, true);

            forever(function trailRenderer() {
                const particle = JupiterCore.SPRITES.create(img`
                . . . .
                . . . .
                . . . .
                . . . .
            `, SpriteKind.Projectile);
                const particleObj = JupiterCore.OBJECTS.create(particle);

                particleObj.build(function particleScript(sprite: Sprite) {
                    sprite.setPosition(ball.x, ball.y);
                    animation.runImageAnimation(sprite, [
                        img`
                        2 2 2 2
                        2 2 2 2
                        2 2 2 2
                        2 2 2 2
                    `,
                        img`
                        . . . .
                        . 2 2 .
                        . 2 2 .
                        . . . .
                    `,
                        img`
                        . . . .
                        . . . .
                        . . . .
                        . . . .
                    `
                    ], 100, false);

                    sprite.lifespan = 200;
                });

                pause(10);
            });
        });
    }

    Main.build(function onInit() {
        Jupiter.LOGGER.log("Silly :3333");
    });
}