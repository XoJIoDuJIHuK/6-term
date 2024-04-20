import { defineAbility } from "@casl/ability";

export const guestPermissions = defineAbility((can, cannot) => {
    can("read", "ability");
    can("read", "commit");
    can("read", "repo");
    //
    cannot("delete", "all");
    cannot("update", "all");
    cannot("create", "all");
});

export const userPermissions = (userId) => defineAbility((can) => {
        can("read", "ability");
        can("read", "commit");
        can("read", "repo");
        can("read", "user", userId);
        //
        can("create", "repo");
        can("create", "commit",userId);
        //
        can("update", "repo",  userId);
        can("update", "commit", userId);
    });

export const adminPermissions = defineAbility((can, cannot) => {
    can("manage", "all");
});
