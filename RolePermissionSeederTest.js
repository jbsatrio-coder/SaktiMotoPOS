function testRolePermissionRunningNumber(){

    Logger.log(
        "================================"
    );

    Logger.log(
        "ROLE PERMISSION RUNNING NUMBER TEST"
    );

    Logger.log(
        "================================"
    );

    const id =
        RunningNumberService.generate(
            DocumentType.ROLE_PERMISSION
        );

    Logger.log(
        "GENERATED ID:"
    );

    Logger.log(
        id
    );

    Logger.log(
        "================================"
    );

}

function testRolePermissionSeeder(){

    Logger.log(
        "================================"
    );

    Logger.log(
        "ROLE PERMISSION SEEDER TEST"
    );

    Logger.log(
        "================================"
    );

    const result =
        RolePermissionSeeder.seed();

    Logger.log(
        "SEED RESULT:"
    );

    Logger.log(
        JSON.stringify(
            result
        )
    );

    Logger.log(
        "================================"
    );

}

