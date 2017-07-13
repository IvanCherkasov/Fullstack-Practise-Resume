import './index.styl'
import main from './index.pug'
import resumeHeader from '../block-header/index.js'
import resumeProfile from '../block-profile/index.js'
import resumeContacts from '../block-contacts/index.js'
import resumeSkills from '../block-skills/index.js'

export default class{
    //Возвращает DOM объект
    static get(){
        var elem = document.createElement('div');
        elem.id = "resume";
        var left = resumeHeader.init(['Name here','Surname','Graphic designer']);
        left += resumeProfile.init([
            '<span>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. ' +
            'Aenean commodo ligula eget dolor. Aenean massa. Cum sociis ' +
            'natoque penatibus et magnis dis parturient montes, nascetur ' +
            'ridiculus mus. Donec quam felis, ultricies nec, pellentesque ' +
            'eu, pretium quis, sem. Nulla consequat massa quis enim. ' +
            'Donec pede justo, fringilla vel, aliquet nec, vulputate eget, ' +
            'arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, ' +
            'justo. Nullam dictum felis eu <b>pede mollis pretium. Integer ' +
            'tincidunt. Cras dapibus. Vivamus elementum semper nisi. ' +
            'Aenean vulputate eleifend tellus. Aenean leo ligula, ' +
            'porttitor eu, consequat vitae, eleifend ac, enim. Aliquam ' +
            'lorem ante, dapibus in, viverra quis, feugiat a, tellus. ' +
            'Phasellus viverra nulla ut metus varius laoreet. Quisque ' +
            'rutrum. </b></span>'
        ]);
        left += resumeContacts.init([
            ['Address', 'Main Street, City.'],
            ['E-mail', 'contact@domain.com'],
            ['Phone', '555-555-555'],
            ['Website', 'www.yourweb.com']
        ]);
        left += resumeSkills.init([12,[
            ['Creative','9'],
            ['Teamwork','11'],
            ['Innovate','6'],
            ['Communication','11']
        ]]);

        elem.innerHTML = main([left, 'right']);

        return elem;
    }
}