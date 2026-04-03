import { addPage, NamedPage, $, Socket } from '@hydrooj/ui-default';
 
addPage(new NamedPage(['problem_detail', 'homework_detail_problem', 'contest_detail_problem'], () => {
    const imageUrl = UiContext.acImgUrl || '/ac-congrats.png';
    const timer = UiContext.acImgDuration || 3500;
    const prevStatus = new Map();

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
    const sock = new Socket(UiContext.ws_prefix + UiContext.pretestConnUrl);
    
    sock.onmessage = (message) => {
        if (message.data === 'ping') return;
        const msg = JSON.parse(message.data);
        const rdoc = msg.rdoc;
        const rid = rdoc._id.toString();
        const prev = prevStatus.get(rid);

        if (rdoc.contest && !UiContext.showInContest) return;
        if (rdoc.contest && rdoc.contest.toString() === '000000000000000000000000') return;
        if (rdoc.status === 1 && prev !== 1 && rdoc.uid === UserContext._id) {
            modal.find('img').attr('src', imageUrl);
            modal.css('display', 'flex');
            setTimeout(() => {
                modal.css('display', 'none');
            }, timer);
        }
        prevStatus.set(rid, rdoc.status);
    };
    
    return () => {
        sock.close();
        $('#ac-congrats-modal').remove();
    };
}));