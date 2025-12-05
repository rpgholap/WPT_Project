export function storeUser(role){
    localStorage.setItem("user_id",role);
}

export function getUser(){
    return localStorage.getItem("user_id");
}

export function removeUser(){
    localStorage.removeItem("user_id");
}