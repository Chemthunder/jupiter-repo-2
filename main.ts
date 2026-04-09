namespace JupiterCore {
    export const ID = "JupiterCore";

    export const MainPlane = Cohesion.Builders.createPlane();
    export const Core = Cohesion.Builders.createProject(MainPlane);

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
    export const Main = Cohesion.Builders.createProject(JupiterCore.MainPlane);
    export const ID = "Jupiter";
    export const LOGGER = new Logger(ID);

    export const mainPlayer = JupiterCore.SPRITES.create(img`
        1 1 1 1
        1 1 1 1
        1 1 1 1
        1 1 1 1
    `, SpriteKind.Player);
    export const playerObj = JupiterCore.OBJECTS.create(mainPlayer);

    playerObj.build(function playerObjScript(sprite: Sprite) {
        let speed = 100;
        let shouldShowTrail = true;

        forever(function controls() {
            controller.moveSprite(sprite, speed, speed);
        });

        forever(function dash() {
            if (controller.A.isPressed()) {
                speed = 200;
            } else {
                speed = 100;
            }
        });

        forever(function trailRenderer() {
            if (shouldShowTrail) {
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

            info.setScore(sprites.allOfKind(SpriteKind.Projectile).length);
        });
    });

    export const ball = JupiterCore.SPRITES.create(img`
        2 2 2 2
        2 2 2 2
        2 2 2 2
        2 2 2 2
    `, SpriteKind.Enemy);
    export const ballObj = JupiterCore.OBJECTS.create(ball);

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

    Main.build(function onInit() {
        Jupiter.LOGGER.log("Silly :3333");
    });
}