import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];
export default function App() {
  const [show, setShow] = useState(false);
  const [friend, setFriend] = useState(initialFriends);
  const [selectfriend, setselectfriend] = useState(null);
  function handleaddfriend(nfriend) {
    setFriend((friendss) => [...friendss, nfriend]);
  }
  function handleshow() {
    setShow((show) => !show);
  }
  function handleselect(friend) {
    setselectfriend((selected) => (selected?.id === friend.id ? null : friend));
    setShow(false);
  }
  function handlesplitbill(value) {
    setFriend((friends) =>
      friends.map((friend) =>
        friend.id === selectfriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
    setselectfriend(null);
  }
  return (
    <div className="app">
      <div className="sidebar">
        <Friendslist
          friends={friend}
          onselect={handleselect}
          selectfriend={selectfriend}
        />
        {show && (
          <Formaddfriend
            onaddfriend={handleaddfriend}
            onhandleshow={handleshow}
          />
        )}
        <Button onclick={handleshow}>{show ? "close" : "Add friend"}</Button>
      </div>
      {selectfriend && (
        <FormSplitBill
          selectfriend={selectfriend}
          onsplitbill={handlesplitbill}
        />
      )}
    </div>
  );
}

function Friendslist({ friends, selectfriend, onselect }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          selectfriend={selectfriend}
          key={friend.id}
          onselect={onselect}
        />
      ))}
    </ul>
  );
}
function Friend({ friend, selectfriend, onselect }) {
  const isselected = selectfriend?.id === friend.id;
  return (
    <li className={isselected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance > 0 && (
        <p className="green">
          You owe {friend.name} {Math.abs(friend.balance)}&#x20AC;
        </p>
      )}
      {friend.balance < 0 && (
        <p className="red">
          {friend.name} ows you {Math.abs(friend.balance)}&#x20AC;
        </p>
      )}
      {friend.balance === 0 && <p>you and {friend.name} are even</p>}
      <button className="button" onClick={() => onselect(friend)}>
        {isselected ? "Close" : "Select"}
      </button>
    </li>
  );
}
function Button({ children, onclick }) {
  return (
    <button className="button" onClick={onclick}>
      {children}
    </button>
  );
}
function Formaddfriend({ onaddfriend, onhandleshow }) {
  const [name, setname] = useState("");
  const [image, setimage] = useState("https://i.pravatar.cc/48");
  function handleonsubmit(e) {
    e.preventDefault();
    const id = crypto.randomUUID();
    const newfriend = { name, image: `${image}?=${id}`, id, balance: 0 };
    onaddfriend(newfriend);
    setname("");
    setimage("https://i.pravatar.cc/48");
    onhandleshow();
  }
  return (
    <form className="form-add-friend" onSubmit={handleonsubmit}>
      <label>🧑‍🤝‍🧑 friend name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setname(e.target.value)}
      />

      <label>🏞️ Image url</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setimage(e.target.value)}
      />
      <Button>Add</Button>
    </form>
  );
}
function FormSplitBill({ selectfriend, onsplitbill }) {
  const [bill, setbill] = useState("");
  const [paidbyuser, setpaidbyuser] = useState("");
  const [whoispaying, setwhoispaying] = useState("user");
  const paidbyfriend = bill ? bill - paidbyuser : "";
  function handlesubmit(e) {
    e.preventDefault();
    if (!bill || !paidbyuser) return;
    onsplitbill(whoispaying === "user" ? paidbyfriend : -paidbyuser);
  }
  return (
    <form className="form-split-bill" onSubmit={handlesubmit}>
      <h2>split a bill with {selectfriend.name}</h2>
      <label>💴 Bill value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setbill(Number(e.target.value))}
      />

      <label>🧑 Your Expense</label>
      <input
        type="text"
        value={paidbyuser}
        onChange={(e) =>
          setpaidbyuser(
            Number(e.target.value) > bill ? paidbyuser : Number(e.target.value)
          )
        }
      />

      <label>🧑‍🤝‍🧑 {selectfriend.name}'s Expense</label>
      <input type="text" disabled value={paidbyfriend} />

      <label>🤑 Who is paying the bill</label>
      <select
        value={whoispaying}
        onChange={(e) => setwhoispaying(e.target.value)}
      >
        <option value="user">You</option>
        <option value="friend">{selectfriend.name}</option>
      </select>
      <Button>Split Bill</Button>
    </form>
  );
}
