'use client'

import React from 'react';
import Image from 'next/image';

export default function HowToPlay({ textSize, iconSize }: { textSize: string, iconSize: number }) {
  return (
    <div>
        {/* You can open the modal using document.getElementById('ID').showModal() method */}
<button className={`flex bg-transparent items-center text-[26px] text-[#BFE528]`} onClick={() => {
  const modal = document?.getElementById('my_modal_3');
  if (modal) {
    (modal as HTMLDialogElement).showModal();
  }
}}><Image src="/green-info.png" alt='info' width={iconSize} height={iconSize}  /> How to play and win</button>
<dialog id="my_modal_3" className="modal">
  <div className="modal-box">
    <form method="dialog">
      {/* if there is a button in form, it will close the modal */}
      <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
    </form>
    <h3 className="font-bold text-lg">Hello!</h3>
    <p className="py-4">Press ESC key or click on ✕ button to close</p>
  </div>
</dialog>
    </div>
  )
}
