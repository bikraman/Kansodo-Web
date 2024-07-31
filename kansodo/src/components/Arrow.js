import arrowCollapsed from '../assets/arrow_collapsed.png'
import arrowExpanded from '../assets/arrow_expanded.png'

export default function Arrow ({ onClick, doesHaveChildren, isExpanded}) {

    if (isExpanded)
        return <span onClick={onClick} style={{ visibility: doesHaveChildren ? 'visible' : 'hidden'}} className='list-item-arrow' ><img  src = {arrowExpanded}/></span>
    else
        return <span onClick={onClick} style={{ visibility: doesHaveChildren ? 'visible' : 'hidden'}} className='list-item-arrow' ><img  src = {arrowCollapsed}/></span>
};