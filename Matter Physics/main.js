var config = {
    type: Phaser.Auto,
    width: 800,
    height: 600,
    backgroundColor: '#000000',
    parent: 'phaser-example',
    physics: {
        default: 'matter',
        matter: {
            gravity: {
                y: 0.8
            },
            debug: true,
            debugBodyColor: 0xffffff
        }
    },
    scene: {
        create: create
    }
};

var game = new Phaser.Game(config)

function create() {
    this.matter.world.setBounds();

    this.matter.add.mouseSpring();

    //add rectangles on the left
    this.matter.add.rectangle(770, 490, 220, 380, {
        isStatic: true,
        chamfer: { radius: 20 }
    });

    //add rectangles on the right
    this.matter.add.rectangle(30, 490, 220, 380, {
        isStatic: true,
        chamfer: { radius: 20 }
    });

    //manually add rectangle
    var bods = Phaser.Physics.Matter.Matter.Bodies
    var rect1 = bods.rectangle(400, 400, 50, 50)
    this.matter.world.add(rect1);

    //creating rectangle and circles

    var rect = bods.rectangle(200, 200, 50, 50)
    var circ1 = bods.circle(250, 200, 25)
    var circ2 = bods.circle(150, 200, 25)

    //compound body intersects the circles and rectangle.
    var compoundBody = Phaser.Physics.Matter.Matter.Body.create({
        parts: [rect, circ1, circ2]
    })

    //this adds a constraint that keeps the shape in a certain point on the screen and it can be dragged slightly
    this.matter.add.worldConstraint(compoundBody, 200, 0.1, {
        pointA: { x: 400, y: 200 },
        pointB: { x: 50, y: 0 }
    });
    this.matter.add.worldConstraint(compoundBody, 200, 0.1, {
        pointA: { x: 300, y: 200 },
        pointB: { x: -50, y: 0 }
    });


    this.matter.world.add(compoundBody)

    //cool functions
    //add boxes in a square grid, this is 6 in a column and 3 in a row.
    var stack = this.matter.add.pyramid(250, 50, 10, 10, 0, 0, function (x, y) {
        return bods.rectangle(x, y, 50, 50, Phaser.Math.Between(20, 40))
    })

    var group = this.matter.world.nextGroup(true);

    var chain = this.matter.add.stack(450, 100, 12, 1, 0, 0, function (x, y) {
        return bods.rectangle(x - 20, y, 53, 20, {
            collisionFilter: { group: group },
            chamfer: 8,
            density: 0.005,
            frictionAir: 0.05
        })
    })


    this.matter.add.chain(chain, 0.3, 0, -0.3, 0, {
        stiffness: 1,
        length: 0,
        render: {
            visible: true
        }
    });

    this.matter.add.worldConstraint(chain.bodies[0], 2, 0.9, {
        pointA: { x: 450, y: 100 },
        pointB: { x: -25, y: 0 }
    });

    /*//two constraints on a chain
    this.matter.add.worldConstraint(chain.bodies[chain], 2, 0.9, {
        pointA: { x: 450, y: 100 },
        pointB: { x: 25, y: 0 }
    });
    */

    //chain added to a box, can be used with the other constraint to a chain. Divide the length by 2 to create a box in the middle of the chain.
    this.matter.world.add(rect1);
    this.matter.add.joint(chain.bodies[chain.bodies.length - 1], rect1, 80, 0.1);

}


