<script>
  import { onMount } from "svelte";
  import ChatBubbles from "../assets/chat-bubble-dynamic-color.png";
  import { split } from "postcss/lib/list";
  let accepted = false;
  let token = "";
  let showMenu = false;
  let showOrder = false;
  /**
   * @type {any[]}
   */
  let order = [];
  const endpoint = "http://core-route-nickdotcom-dev.apps.sandbox-m2.ll9k.p1.openshiftapps.com";
  /**
   * @type {any}
   */
  let menu = [];
  let message = "";
  /**
   * @type {any[]}
   */
  let messages = [];

  /**
   * @param {number} ms
   */
  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function finishOrder() {}

  /**
   * @param {string} message
   */
  async function sendMessage(message) {
    messages = [
      ...messages,
      {
        message: message,
        fromFoodle: false,
        timeStamp: new Date(),
      },
    ];

    sleep(200).then(() => getPrediction(message));
  }

  /**
   * @param {string} query
   */
  async function getPrediction(query) {
    const response = await fetch(endpoint + "/chat", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: query }),
    });

    const prediction = await response.json();
    if (prediction.orderItems != null) {
      order = order.concat(prediction.orderItems);
      messages = [
        ...messages,
        {
          message: prediction.message,
          orderItems: prediction.orderItems,
          fromFoodle: true,
          timeStamp: new Date(),
        },
      ];
      return prediction;
    }
    if (prediction.message.split("%")[1] === "Menu") {
      messages = [
        ...messages,
        {
          message: prediction.message.split("%")[0],
          menu: true,
          fromFoodle: true,
          timeStamp: new Date(),
        },
      ];
      return prediction;
    }
    else if(prediction.message.split("%")[1] === "Track"){
      messages = [
        ...messages,
        {
          message: prediction.message.split("%")[0],
          track: true,
          fromFoodle: true,
          timeStamp: new Date(),
        },
      ];
      return prediction;
    }
    messages = [
      ...messages,
      {
        message: prediction.message,
        fromFoodle: true,
        timeStamp: new Date(),
      },
    ];
    return prediction;
  }

  async function startSession() {
    const response = await fetch(endpoint + "/session", {
      method: "GET",
    });
    const session = await response.json();
    return session.token;
  }

  async function getMenu() {
    const response = await fetch(endpoint + "/menu", {
      method: "GET",
    });
    const session = await response.json();
    return session;
  }

  onMount(async () => {
    token = await startSession();
    menu = await getMenu();
    await getPrediction("Hello");
  });
</script>

<div
  class="w-screen h-screen flex items-center justify-center gap-6 bg-slate-100"
>
  <div
    class="w-72 h-96 bg-white rounded-[10px] shadow flex-col justify-between items-center inline-flex py-2"
  >
    {#if accepted}
      <div class="self-stretch p-2.5 rounded-[10px] bg-white" />
      <div
        class="self-stretch grow shrink basis-0 px-1.5 flex-col-reverse justify-start items-center gap-2.5 flex overflow-scroll"
      >
        {#each messages.slice().reverse() as message}
          <div
            class={"self-stretch h-fit px-[5px] py-2.5 flex-col justify-center flex gap-[1px] " +
              (message.fromFoodle ? "items-start" : "items-end")}
          >
            {#if message.orderItems === undefined}
              <div
                class={"px-2.5 py-2 justify-start max-w-[220px] items-center gap-2.5 inline-flex rounded-tl-[10px] rounded-tr-[10px]  " +
                  (message.fromFoodle
                    ? "bg-pink-400 rounded-br-[10px]"
                    : "bg-sky-400 rounded-bl-[10px]")}
              >
                <div class="text-zinc-100 text-xs font-normal font-['Inter']">
                  {message.message}
                </div>
              </div>
            {/if}

            {#if message.menu}
              <button
                on:click={() => (showMenu = true)}
                class="w-[122px] h-[41px] px-2.5 py-2 bg-zinc-100 rounded-tl-[10px] rounded-tr-[10px] rounded-br-[10px] justify-center items-center gap-2.5 inline-flex"
              >
                <div class="w-[25px] h-[25px] relative">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="25"
                    height="25"
                    viewBox="0 0 25 25"
                    fill="none"
                  >
                    <path
                      d="M8.43752 13.8958L11.3854 10.9479L4.07294 3.64583C2.44794 5.27083 2.44794 7.90625 4.07294 9.54167L8.43752 13.8958ZM15.5 12.0104C17.0938 12.75 19.3334 12.2292 20.9896 10.5729C22.9792 8.58333 23.3646 5.72917 21.8334 4.19792C20.3125 2.67708 17.4584 3.05208 15.4584 5.04167C13.8021 6.69792 13.2813 8.9375 14.0209 10.5313L3.85419 20.6979L5.32294 22.1667L12.5 15.0104L19.6667 22.1771L21.1354 20.7083L13.9688 13.5417L15.5 12.0104Z"
                      fill="black"
                    />
                  </svg>
                </div>
                <div class="text-black text-xs font-semibold font-['Inter']">
                  Open Menu
                </div>
              </button>
            {/if}
            {#if message.track}
            <!-- Whatever tracking service is used -->
          {/if}
            {#if message.orderItems !== undefined}
              <div
                class="w-fit h-[59.40px] mt-3 flex-col justify-center items-start inline-flex"
              >
                <div
                  class="px-2.5 py-2 bg-lime-600 rounded-tl-[10px] rounded-tr-[10px] rounded-br-[10px] justify-center items-center gap-2.5 inline-flex"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="21"
                    height="21"
                    viewBox="0 0 21 21"
                    fill="none"
                  >
                    <path
                      d="M20.4016 10.2008C20.4016 15.8345 15.8345 20.4016 10.2008 20.4016C4.56703 20.4016 0 15.8345 0 10.2008C0 4.56703 4.56703 0 10.2008 0C15.8345 0 20.4016 4.56703 20.4016 10.2008ZM9.02087 15.602L16.5892 8.0337C16.8462 7.77671 16.8462 7.35999 16.5892 7.103L15.6585 6.1723C15.4015 5.91527 14.9848 5.91527 14.7278 6.1723L8.5555 12.3445L5.67382 9.46284C5.41683 9.20584 5.00012 9.20584 4.74308 9.46284L3.81238 10.3935C3.55539 10.6505 3.55539 11.0672 3.81238 11.3242L8.09013 15.602C8.34717 15.859 8.76384 15.859 9.02087 15.602Z"
                      fill="white"
                    />
                  </svg>
                  <button
                    class="text-white text-xs font-semibold font-['Inter']"
                    >Confirm Order</button
                  >
                </div>

                <div
                  class="pl-[17px] pr-9 py-1 bg-zinc-300 rounded-bl-[10px] rounded-br-[10px] justify-start items-center gap-2.5 flex flex-col"
                >
                  {#each message.orderItems as orderItem}
                    <div
                      class="text-black text-xs font-semibold font-['Inter']"
                    >
                      {orderItem.quantity + "x " + orderItem.dish}
                    </div>
                  {/each}
                </div>
              </div>
            {/if}
            <div
              class="text-center text-black text-[7px] font-normal font-['Inter']"
            >
              {message.timeStamp.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
        {/each}
      </div>
      <div
        class="self-stretch justify-center mt-auto p-2 items-center gap-[40px] inline-flex"
      >
        <input
          bind:value={message}
          type="text"
          placeholder="Type your Message here…"
          class="text-stone-600 text-[13px] font-normal font-['Inter'] focus:outline-none caret-slate-200 placeholder:text-stone-300"
        />
        <button
          on:click={() => {
            sendMessage(message);
            message = "";
          }}
          class="fill-pink-400 hover:fill-pink-500 p-[6px] transition-all rounded-full flex justify-center items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
          >
            <path
              d="M18.3383 7.32071L4.33904 0.321088C3.78656 0.0461119 3.16272 -0.0517814 2.55257 0.0407547C1.94242 0.133291 1.37566 0.411753 0.929552 0.838175C0.483448 1.2646 0.179714 1.81823 0.0597603 2.42358C-0.0601932 3.02894 0.00947168 3.65656 0.259257 4.22088L2.65913 9.59058C2.71358 9.72041 2.74163 9.85978 2.74163 10.0006C2.74163 10.1413 2.71358 10.2807 2.65913 10.4105L0.259257 15.7802C0.0559679 16.2369 -0.0299718 16.7372 0.00924744 17.2355C0.0484667 17.7339 0.211602 18.2145 0.483826 18.6338C0.756051 19.0531 1.12874 19.3977 1.56801 19.6363C2.00728 19.8749 2.49922 19.9999 2.99911 20C3.46731 19.9953 3.92855 19.886 4.34903 19.68L18.3483 12.6804C18.8448 12.4306 19.2622 12.0478 19.5539 11.5746C19.8456 11.1014 20 10.5564 20 10.0006C20 9.4447 19.8456 8.89977 19.5539 8.42657C19.2622 7.95337 18.8448 7.57051 18.3483 7.32071H18.3383ZM17.4483 10.8905L3.44908 17.8901C3.26526 17.9784 3.05884 18.0084 2.8575 17.976C2.65617 17.9436 2.46955 17.8504 2.32266 17.709C2.17577 17.5675 2.07564 17.3846 2.03569 17.1846C1.99574 16.9846 2.01789 16.7772 2.09916 16.5902L4.48903 11.2205C4.51996 11.1488 4.54668 11.0753 4.56902 11.0005H11.4586C11.7238 11.0005 11.9782 10.8952 12.1657 10.7076C12.3532 10.5201 12.4586 10.2658 12.4586 10.0006C12.4586 9.73536 12.3532 9.48102 12.1657 9.29349C11.9782 9.10597 11.7238 9.00062 11.4586 9.00062H4.56902C4.54668 8.92579 4.51996 8.85233 4.48903 8.78063L2.09916 3.41092C2.01789 3.22389 1.99574 3.01649 2.03569 2.81652C2.07564 2.61655 2.17577 2.43358 2.32266 2.29213C2.46955 2.15068 2.65617 2.05752 2.8575 2.02515C3.05884 1.99277 3.26526 2.02272 3.44908 2.11099L17.4483 9.11061C17.6121 9.19452 17.7496 9.32201 17.8456 9.47904C17.9415 9.63606 17.9923 9.81653 17.9923 10.0006C17.9923 10.1846 17.9415 10.3651 17.8456 10.5221C17.7496 10.6791 17.6121 10.8066 17.4483 10.8905Z"
            />
          </svg>
        </button>
      </div>
    {:else}
      <div class="flex-col justify-start items-center flex">
        <img class="w-[180px] h-[190px]" src={ChatBubbles} alt="chat bubbles" />
        <div class="flex-col justify-center items-start flex">
          <div class="text-black text-2xl font-semibold font-['Inter']">
            Hi, I’m Foodle!
          </div>
          <div
            class="text-center text-black text-xs font-normal font-['Inter']"
          >
            Your AI Restaurant Chat Bot
          </div>
        </div>
      </div>
      <button
        class="px-[25px] py-2 rounded-[10px] text-black transition-all border border-pink-400 justify-start items-center gap-2.5 inline-flex hover:border-pink-500 hover:bg-slate-50"
        on:click={() => (accepted = true)}
      >
        <div class=" text-[13px] font-medium font-['Inter']">Get Started</div>
      </button>
    {/if}
  </div>
  {#if showMenu}
    <div
      class="w-72 bg-white h-96 rounded-[10px] shadow flex-col justify-between items-center flex py-2 overflow-scroll"
    >
      {#each menu as course}
        <div class="flex flex-col items-center gap-2 mb-4 mt-4">
          <h1 class="text-center text-black text-sm font-medium">
            {course[0]}
          </h1>
          {#each course[1] as dish, i (i)}
            <div
              class="w-[300px] h-[60px] px-5 justify-between items-center inline-flex"
            >
              <div class="w-[60px] h-[60px] bg-zinc-300 rounded-[15px]" />
              <div
                class="text-center text-black text-xs font-normal font-['Inter']"
              >
                {dish.name}
              </div>
              <div
                class="text-center text-black text-sm font-medium font-['Inter']"
              >
                {dish.price}€
              </div>
            </div>
            {#if i < course[1].length - 1}
              <div class="w-[220px] h-[0px] border border-gray-200" />
            {/if}
          {/each}
        </div>
      {/each}
    </div>
  {/if}
  {#if order.length > 0}
  <div class="flex flex-col gap-0 justify-end absolute bottom-5">
    <button on:mouseenter={() => {showOrder = true;}} on:mouseleave={()=> {showOrder=false}}
      class={"w-[125px] h-[38px] px-2.5 py-2 bg-lime-600 rounded-"+(showOrder ? "t-" : "") + "[10px] rounded-t-xl items-center gap-2.5 inline-flex hover:bg-lime-700 transition-all"}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="25"
        height="20"
        viewBox="0 0 25 20"
        fill="none"
      >
        <path
          d="M0.5 17.3334C0.5 18.4375 1.39583 19.3334 2.5 19.3334H22.5C23.6042 19.3334 24.5 18.4375 24.5 17.3334V10H0.5V17.3334ZM8.5 14.5C8.5 14.225 8.725 14 9 14H14.6667C14.9417 14 15.1667 14.225 15.1667 14.5V16.1667C15.1667 16.4417 14.9417 16.6667 14.6667 16.6667H9C8.725 16.6667 8.5 16.4417 8.5 16.1667V14.5ZM3.16667 14.5C3.16667 14.225 3.39167 14 3.66667 14H6.66667C6.94167 14 7.16667 14.225 7.16667 14.5V16.1667C7.16667 16.4417 6.94167 16.6667 6.66667 16.6667H3.66667C3.39167 16.6667 3.16667 16.4417 3.16667 16.1667V14.5ZM24.5 2.66669V4.66669H0.5V2.66669C0.5 1.56252 1.39583 0.666687 2.5 0.666687H22.5C23.6042 0.666687 24.5 1.56252 24.5 2.66669Z"
          fill="white"
        />
      </svg>
      <div class="text-white text-sm font-semibold font-['Inter']">
        Checkout
      </div>
    </button>
    <div
      class={"pl-[17px] pr-9 py-1 bg-zinc-300 rounded-b-[10px] justify-start items-center gap-2.5 flex flex-col " + (showOrder ? "" : "invisible") }
    >
      {#each order as orderItem}
        <div class="text-black text-xs font-semibold font-['Inter']">
          {orderItem.quantity + "x " + orderItem.dish}
        </div>
      {/each}
    </div>
  </div>
  {/if}
</div>
