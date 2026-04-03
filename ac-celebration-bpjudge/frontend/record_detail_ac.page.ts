import { addPage, NamedPage, $, Socket } from '@hydrooj/ui-default';
 
addPage(new NamedPage('record_detail', () => {
    if (!UiContext.socketUrl || !UiContext.rdoc) return;
    
    const imageUrl = UiContext.acImgUrl || '/ac-congrats.png';
    const timer = UiContext.acImgDuration || 3500;
    const rdoc = UiContext.rdoc;
    
    const modal = $(`
        <div id="ac-congrats-modal" style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            display: none;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            cursor: pointer;
        ">
            <img src="${imageUrl}" alt="Congrats" style="max-width: 500px; width: auto; height: auto;" />
        </div>
    `).appendTo('body');
    
    const sock = new Socket(UiContext.ws_prefix + UiContext.socketUrl, false, true);
    
    sock.onmessage = (_, data) => {
        const msg = JSON.parse(data);
        const msgStatus = msg.status || msg.rdoc?.status;
        if (msgStatus === undefined) return;
        
        if (rdoc.contest && !UiContext.showInContest) return;
        if (rdoc.contest && rdoc.contest.toString() === '000000000000000000000000') return;
        // 状态从非 AC 变为 AC，且是当前用户的记录
        if (msgStatus === 1 && rdoc.status !== 1 && rdoc.uid === UserContext._id) {
            modal.find('img').attr('src', imageUrl);
            modal.css('display', 'flex');
            setTimeout(() => {
                modal.css('display', 'none');
            }, timer);
        }
    };
    
    return () => {
        sock.close();
        $('#ac-congrats-modal').remove();
    };
}));